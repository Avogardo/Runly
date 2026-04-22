import {FC} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {GlassCard, theme} from '@/ui'

type StatsBarProps = {
  stats: Stat[]
}

type Stat = {
  label: string
  value: string
}

export const StatsBar: FC<StatsBarProps> = ({stats}) => {
  return (
    <GlassCard style={styles.wrapper}>
      <View style={styles.row}>
        {stats.map((stat, i) => (
          <View key={stat.label} style={[styles.statItem, i < stats.length - 1 && styles.divider]}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: theme.surfaceBorder
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary
  },
  label: {
    fontSize: 10,
    color: theme.textSecondary,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
})
