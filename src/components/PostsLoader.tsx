import React  from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { THEME } from '../lib/theme';
import { Skeleton } from './Skeleton';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SkeletonPost: React.FC = () => {
  const renderShimmerCard = (key: number) => (
    <View key={key} style={styles.skeletonCard}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton style={styles.avatar} />
        <View style={styles.headerText}>
          <Skeleton style={styles.name} />
          <Skeleton style={styles.time} />
        </View>
      </View>

      {/* Content */}
      <Skeleton style={styles.content} />

      {/* Footer */}
      <View style={styles.footer}>
        <Skeleton style={styles.footerButton} />
        <Skeleton style={styles.footerButton} />
        <Skeleton style={styles.footerButton} />
      </View>

    </View>
  );

  return <View style={styles.container}>{[0, 1, 2].map(renderShimmerCard)}</View>;
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  skeletonCard: {
    marginBottom: 16,
    width: "100%",
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.surface, marginRight: 12 },
  headerText: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { width: '50%', height: 14, borderRadius: 6, backgroundColor: THEME.surface, marginBottom: 4 },
  time: { width: 30, height: 12, borderRadius: 5, backgroundColor: THEME.surface },
  content: { width: '100%', height: SCREEN_HEIGHT * 0.5, borderRadius: 24, backgroundColor: THEME.surface, marginBottom: 12, overflow: 'hidden' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  footerButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: THEME.surface },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: 200, // width of the moving shimmer
  },
});
