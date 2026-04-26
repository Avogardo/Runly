import {type FC} from 'react'
import {LinearGradient} from 'expo-linear-gradient'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {theme} from '@/ui'

import {AccountBar, RunCard} from '../components'
import {useRunHistory} from '../hooks'

export const HistoryScreen: FC = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const {runs, isLoading} = useRunHistory()

  if (isLoading) {
    return (
      <LinearGradient
        colors={[...theme.bgGradient]}
        style={[styles.centered, {paddingTop: insets.top}]}
      >
        <Text style={styles.loadingText}>{t('historyScreen.label.loading')}</Text>
      </LinearGradient>
    )
  }

  if (runs.length === 0) {
    return (
      <LinearGradient
        colors={[...theme.bgGradient]}
        style={styles.gradient}
      >
        <AccountBar />
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🏁</Text>
          <Text style={styles.emptyText}>{t('historyScreen.label.emptyTitle')}</Text>
          <Text style={styles.emptyHint}>{t('historyScreen.label.emptyHint')}</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<AccountBar />}
        renderItem={({item}) => <RunCard run={item} />}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    fontSize: 16,
    color: theme.textSecondary
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8
  },
  emptyHint: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center'
  },
  list: {
    flex: 1
  },
  listContent: {
    padding: 16,
    gap: 12
  }
})
