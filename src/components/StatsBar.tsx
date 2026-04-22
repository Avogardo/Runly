import {View, Text, StyleSheet} from 'react-native'

type Stat = {
  label: string
  value: string
}

type StatsBarProps = {
  stats: Stat[]
}

export default function StatsBar({stats}: StatsBarProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statItem}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E'
  },
  label: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  }
})
