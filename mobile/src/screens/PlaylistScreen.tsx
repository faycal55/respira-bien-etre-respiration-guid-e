import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Slider,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store';

interface AudioTrack {
  id: string;
  title: string;
  src: string;
  duration?: number;
  category: string;
  source: string;
  description?: string;
}

const AUDIO_TRACKS: Record<string, AudioTrack[]> = {
  'Nature & Ambiances': [
    {
      id: '1',
      title: 'Vagues de l\'océan',
      src: '/audio/ocean-waves.ogg',
      category: 'Nature & Ambiances',
      source: 'Wikimedia Commons',
      description: 'Sons apaisants des vagues sur la plage',
      duration: 600, // 10 minutes
    },
    {
      id: '2',
      title: 'Oiseaux de la forêt',
      src: '/audio/forest-birds.ogg',
      category: 'Nature & Ambiances',
      source: 'Wikimedia Commons',
      description: 'Chants d\'oiseaux dans une forêt paisible',
      duration: 480,
    },
    {
      id: '3',
      title: 'Vent dans la forêt',
      src: '/audio/wind-forest.ogg',
      category: 'Nature & Ambiances',
      source: 'Wikimedia Commons',
      description: 'Bruissement du vent dans les arbres',
      duration: 720,
    },
    {
      id: '4',
      title: 'Pluie légère',
      src: '/audio/rain-light.ogg',
      category: 'Nature & Ambiances',
      source: 'Wikimedia Commons',
      description: 'Pluie douce et régulière',
      duration: 900,
    },
  ],
  
  'Détente & Méditation': [
    {
      id: '5',
      title: 'Deep Tones',
      src: '/audio/deep-tones.mp3',
      category: 'Détente & Méditation',
      source: 'freepd.com',
      description: 'Tons profonds pour la méditation',
      duration: 360,
    },
    {
      id: '6',
      title: 'Serene View',
      src: '/audio/serene-view.mp3',
      category: 'Détente & Méditation',
      source: 'freepd.com',
      description: 'Ambiance sereine et contemplative',
      duration: 420,
    },
    {
      id: '7',
      title: 'Yoga 417Hz',
      src: '/audio/yoga-417hz.mp3',
      category: 'Détente & Méditation',
      source: 'freepd.com',
      description: 'Fréquence 417Hz pour la transformation',
      duration: 600,
    },
    {
      id: '8',
      title: 'Yoga 528Hz',
      src: '/audio/yoga-528hz.mp3',
      category: 'Détente & Méditation',
      source: 'freepd.com',
      description: 'Fréquence 528Hz pour l\'amour et la guérison',
      duration: 600,
    },
  ],
  
  'Ambiances Urbaines': [
    {
      id: '9',
      title: 'Ambiance urbaine',
      src: '/audio/city-ambience.ogg',
      category: 'Ambiances Urbaines',
      source: 'Wikimedia Commons',
      description: 'Sons de la ville en arrière-plan',
      duration: 540,
    },
    {
      id: '10',
      title: 'Centre commercial',
      src: '/audio/city-mall.ogg',
      category: 'Ambiances Urbaines',
      source: 'Wikimedia Commons',
      description: 'Ambiance feutrée d\'un centre commercial',
      duration: 480,
    },
  ],
  
  'Autres Ambiances': [
    {
      id: '11',
      title: 'Cheminée',
      src: '/audio/fireplace.ogg',
      category: 'Autres Ambiances',
      source: 'Wikimedia Commons',
      description: 'Crépitement du feu dans la cheminée',
      duration: 600,
    },
    {
      id: '12',
      title: 'Aquarium',
      src: '/audio/aquarium.mp3',
      category: 'Autres Ambiances',
      source: 'freepd.com',
      description: 'Bulles et filtration d\'aquarium',
      duration: 720,
    },
  ],
};

const CATEGORIES = Object.keys(AUDIO_TRACKS);

const PlaylistScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { settings } = useSettingsStore();

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Refs pour la gestion audio (à implémenter avec react-native-sound)
  const audioRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.release();
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackPress = async (track: AudioTrack) => {
    try {
      // Arrêter la piste actuelle si elle existe
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.release();
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.duration || 0);

      // TODO: Implémenter la lecture audio avec react-native-sound
      // const sound = new Sound(track.src, Sound.MAIN_BUNDLE, (error) => {
      //   if (error) {
      //     Alert.alert('Erreur', 'Impossible de charger cette piste audio');
      //     return;
      //   }
      //   audioRef.current = sound;
      //   setDuration(sound.getDuration());
      //   playTrack();
      // });

      // Pour l'instant, simuler la lecture
      setIsPlaying(true);
      startProgressTimer();

    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire cette piste audio');
    }
  };

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play((success: boolean) => {
        if (success) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      });
      setIsPlaying(true);
      startProgressTimer();
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopProgressTimer();
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
      stopProgressTimer();
    }
  };

  const startProgressTimer = () => {
    progressInterval.current = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.getCurrentTime((seconds: number) => {
          setCurrentTime(seconds);
        });
      } else {
        // Simulation pour la démo
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            setIsPlaying(false);
            stopProgressTimer();
            return 0;
          }
          return newTime;
        });
      }
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handleSeek = (value: number) => {
    const seekTime = (value / 100) * duration;
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.setCurrentTime(seekTime);
    }
  };

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryTab,
              {
                backgroundColor: selectedCategory === item 
                  ? theme.colors.primary 
                  : theme.colors.surfaceVariant,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryTabText,
              {
                color: selectedCategory === item 
                  ? '#ffffff' 
                  : theme.colors.text,
              }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderTrackItem = ({ item }: { item: AudioTrack }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.trackCard,
          {
            backgroundColor: isCurrentTrack 
              ? theme.colors.primaryLight 
              : theme.colors.surface,
            borderColor: isCurrentTrack 
              ? theme.colors.primary 
              : theme.colors.border,
          }
        ]}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.trackHeader}>
          <View style={styles.trackInfo}>
            <Text style={[
              styles.trackTitle,
              {
                color: isCurrentTrack 
                  ? theme.colors.primary 
                  : theme.colors.text,
              }
            ]}>
              {item.title}
            </Text>
            <Text style={[styles.trackDuration, { color: theme.colors.textMuted }]}>
              {formatTime(item.duration || 0)}
            </Text>
          </View>
          
          <View style={[
            styles.playButton,
            {
              backgroundColor: isCurrentTrack && isPlaying 
                ? theme.colors.warning.main 
                : theme.colors.primary,
            }
          ]}>
            <Text style={styles.playButtonText}>
              {isCurrentTrack && isPlaying ? '⏸' : '▶'}
            </Text>
          </View>
        </View>
        
        {item.description && (
          <Text style={[styles.trackDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        )}
        
        <Text style={[styles.trackSource, { color: theme.colors.textMuted }]}>
          Source: {item.source}
        </Text>
        
        {isCurrentTrack && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }
                ]}
              />
            </View>
            <View style={styles.timeLabels}>
              <Text style={[styles.timeLabel, { color: theme.colors.textMuted }]}>
                {formatTime(currentTime)}
              </Text>
              <Text style={[styles.timeLabel, { color: theme.colors.textMuted }]}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPlayer = () => {
    if (!currentTrack) return null;

    return (
      <View style={[styles.player, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <View style={styles.playerHeader}>
          <View style={styles.playerInfo}>
            <Text style={[styles.playerTitle, { color: theme.colors.text }]}>
              {currentTrack.title}
            </Text>
            <Text style={[styles.playerCategory, { color: theme.colors.textSecondary }]}>
              {currentTrack.category}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              stopTrack();
              setCurrentTrack(null);
            }}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.textMuted }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.playerControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
            onPress={isPlaying ? pauseTrack : playTrack}
          >
            <Text style={styles.controlButtonText}>
              {isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.error.main }]}
            onPress={stopTrack}
          >
            <Text style={styles.controlButtonText}>⏹</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.volumeContainer}>
          <Text style={[styles.volumeLabel, { color: theme.colors.textSecondary }]}>
            Volume
          </Text>
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbStyle={{ backgroundColor: theme.colors.primary }}
          />
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Sons Apaisants
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        Ambiances sonores pour la détente et la méditation
      </Text>
    </View>
  );

  const currentTracks = AUDIO_TRACKS[selectedCategory] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <FlatList
        data={currentTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            {renderHeader()}
            {renderCategoryTabs()}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {renderPlayer()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  categoryTabs: {
    marginBottom: 20,
  },
  categoryList: {
    paddingHorizontal: 4,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trackCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackDuration: {
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  trackDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  trackSource: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 12,
  },
  player: {
    borderTopWidth: 1,
    padding: 16,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playerCategory: {
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  volumeContainer: {
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  volumeSlider: {
    width: 200,
    height: 40,
  },
});

export default PlaylistScreen;
