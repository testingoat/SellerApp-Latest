import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deliveryAreaService } from '../services/deliveryAreaService';
import { locationService } from '../services/locationService';
import { locationUtils } from '../utils/locationUtils';
import { CONFIG } from '../config';
import { useSafeTheme } from '../hooks/useSafeTheme';

const DeliveryAreaScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useSafeTheme();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storeLocation, setStoreLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [initialRadius, setInitialRadius] = useState(5);

  // Initialize location utils and load data
  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      setIsLoading(true);

      // Initialize location utils with Google Maps API key
      await locationUtils.initialize(CONFIG.GOOGLE_MAPS_API_KEY);

      // Fetch store location
      const locationResponse = await locationService.getStoreLocation();
      if (locationResponse.success && locationResponse.storeLocation) {
        const { latitude, longitude, address } = locationResponse.storeLocation;

        if (latitude && longitude) {
          setStoreLocation({ latitude, longitude, address: address || '' });

          // Set initial map region
          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else {
          Alert.alert(
            'Store Location Not Set',
            'Please set your store location first before configuring delivery area.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
      } else {
        Alert.alert(
          'Error',
          'Failed to load store location. Please try again.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // Fetch existing delivery area
      const deliveryAreaResponse = await deliveryAreaService.getDeliveryArea();
      if (deliveryAreaResponse.success && deliveryAreaResponse.data) {
        const radius = deliveryAreaResponse.data.radius || 5;
        const areaUnit = deliveryAreaResponse.data.unit || 'km';
        setDeliveryRadius(radius);
        setInitialRadius(radius);
        setUnit(areaUnit);
      }
    } catch (error) {
      console.error('Screen initialization error:', error);
      Alert.alert('Error', 'Failed to initialize screen. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const result = await locationUtils.geocodeAddress(searchQuery);
        if (result && mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: result.coordinates.latitude,
            longitude: result.coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        Alert.alert('Search Error', 'Could not find the address. Please try again.');
      }
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta / 2,
        longitudeDelta: mapRegion.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(newRegion);
      setMapRegion(newRegion);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 2,
        longitudeDelta: mapRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(newRegion);
      setMapRegion(newRegion);
    }
  };

  const handleCurrentLocation = () => {
    if (storeLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleRadiusChange = (value: number) => {
    const newRadius = Math.round(value);
    setDeliveryRadius(newRadius);
    setHasUnsavedChanges(newRadius !== initialRadius);
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'km' ? 'miles' : 'km';
    setUnit(newUnit);
    setHasUnsavedChanges(true);

    // Convert radius when switching units
    if (newUnit === 'miles') {
      // Convert km to miles (1 km = 0.621371 miles)
      setDeliveryRadius(Math.round(deliveryRadius * 0.621371));
    } else {
      // Convert miles to km (1 mile = 1.60934 km)
      setDeliveryRadius(Math.round(deliveryRadius * 1.60934));
    }
  };

  const handleClearArea = () => {
    Alert.alert(
      'Clear Delivery Area',
      'Are you sure you want to clear the delivery area? This will reset your delivery radius to 0.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true);
              const response = await deliveryAreaService.clearDeliveryArea();

              if (response.success) {
                setDeliveryRadius(0);
                setInitialRadius(0);
                setHasUnsavedChanges(false);
                Alert.alert('Success', 'Delivery area cleared successfully');
              } else {
                Alert.alert('Error', response.error || 'Failed to clear delivery area');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear delivery area. Please try again.');
            } finally {
              setIsSaving(false);
            }
          }
        },
      ]
    );
  };

  const handleSaveArea = async () => {
    if (deliveryRadius === 0) {
      Alert.alert('Invalid Radius', `Please set a delivery radius greater than 0 ${unit}.`);
      return;
    }

    try {
      setIsSaving(true);
      const response = await deliveryAreaService.setDeliveryArea({
        radius: deliveryRadius,
        unit: unit,
        isActive: true,
      });

      if (response.success) {
        setInitialRadius(deliveryRadius);
        setHasUnsavedChanges(false);
        Alert.alert(
          'Success',
          `Delivery area saved with ${deliveryRadius} ${unit} radius`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to save delivery area');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save delivery area. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetStarted = () => {
    setShowGetStarted(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading delivery area...</Text>
      </View>
    );
  }

  // Show error state if no store location
  if (!storeLocation || !mapRegion) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Icon name="location-off" size={64} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Store location not available</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={initializeScreen}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Delivery Area</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
        >
          {/* Store Location Marker */}
          {storeLocation && (
            <Marker
              coordinate={{
                latitude: storeLocation.latitude,
                longitude: storeLocation.longitude,
              }}
              title="Your Store"
              description={storeLocation.address}
              pinColor="#3be340"
            />
          )}

          {/* Delivery Radius Circle */}
          {storeLocation && deliveryRadius > 0 && (
            <Circle
              center={{
                latitude: storeLocation.latitude,
                longitude: storeLocation.longitude,
              }}
              radius={unit === 'km' ? deliveryRadius * 1000 : deliveryRadius * 1609.34} // Convert to meters
              fillColor="rgba(59, 227, 64, 0.2)"
              strokeColor="rgba(59, 227, 64, 0.8)"
              strokeWidth={2}
            />
          )}
        </MapView>

        {/* Map Overlay Controls */}
        <View style={styles.mapOverlay}>
          {/* Search Bar */}
          <View style={[styles.searchContainer, { 
            backgroundColor: colors.card,
            shadowColor: isDarkMode ? '#000' : '#000',
          }]}>
            <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for an address"
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <View style={[styles.zoomControls, {
              backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              shadowColor: isDarkMode ? '#000' : '#000',
            }]}>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                <Icon name="add" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                <Icon name="remove" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.locationButton, {
              backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              shadowColor: isDarkMode ? '#000' : '#000',
            }]} onPress={handleCurrentLocation}>
              <Icon name="my-location" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delivery Radius Control */}
      <View style={[styles.radiusContainer, { backgroundColor: colors.card }]}>
        <View style={styles.radiusHeader}>
          <View style={styles.radiusLabelContainer}>
            <Text style={[styles.radiusLabel, { color: colors.text }]}>Delivery Radius</Text>
            {hasUnsavedChanges && (
              <View style={styles.unsavedBadge}>
                <Text style={styles.unsavedBadgeText}>Unsaved</Text>
              </View>
            )}
          </View>
          <View style={styles.radiusValueContainer}>
            <Text style={[styles.radiusValue, { color: colors.text }]}>{deliveryRadius} {unit}</Text>
            <TouchableOpacity
              style={[styles.unitToggle, {
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary + '50',
              }]}
              onPress={handleUnitToggle}
              disabled={isSaving}
            >
              <Text style={[styles.unitToggleText, { color: colors.primary }]}>{unit === 'km' ? 'KM' : 'MI'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={unit === 'km' ? 20 : 12}
            value={deliveryRadius}
            onValueChange={handleRadiusChange}
            step={1}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary + '50'}
            thumbTintColor={colors.primary}
            disabled={isSaving}
          />
          <View style={styles.radiusMarkers}>
            <Text style={[styles.radiusMarkerText, { color: colors.textSecondary }]}>0 {unit}</Text>
            <Text style={[styles.radiusMarkerText, { color: colors.textSecondary }]}>{unit === 'km' ? '10' : '6'} {unit}</Text>
            <Text style={[styles.radiusMarkerText, { color: colors.textSecondary }]}>{unit === 'km' ? '20' : '12'} {unit}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        paddingBottom: bottomPadding,
      }]}>

        <TouchableOpacity
          style={[styles.clearButton, {
            borderColor: colors.primary,
          }, isSaving && styles.buttonDisabled]}
          onPress={handleClearArea}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.clearButtonText, { color: colors.primary }]}>Clear Area</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, {
            backgroundColor: colors.primary,
          }, isSaving && styles.buttonDisabled]}
          onPress={handleSaveArea}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Area</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Get Started Modal */}
      <Modal
        visible={showGetStarted}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGetStarted(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Set Delivery Area</Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Define your delivery boundaries by setting a radius or drawing custom zones on the map.
            </Text>
            <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: colors.primary }]} onPress={handleGetStarted}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
    pointerEvents: 'box-none',
  },
  searchContainer: {
    position: 'relative',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 16,
    zIndex: 1,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingLeft: 44,
    paddingVertical: 16,
    fontSize: 16,
  },
  mapControls: {
    alignItems: 'flex-end',
    gap: 12,
  },
  zoomControls: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    height: 1,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radiusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  radiusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  unsavedBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unsavedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78350f',
    textTransform: 'uppercase',
  },
  radiusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radiusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  unitToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sliderContainer: {
    position: 'relative',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  radiusMarkerText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  getStartedButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default DeliveryAreaScreen;
