import {type FC} from 'react'
import {TextInput, Text, View, StyleSheet, type TextInputProps} from 'react-native'

import {theme} from '@/ui'

type AuthInputProps = TextInputProps & {
  label: string
  error?: string
}

export const AuthInput: FC<AuthInputProps> = ({label, error, style, ...props}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={theme.textMuted}
        selectionColor={theme.accent}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%'
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.textPrimary
  },
  inputError: {
    borderColor: theme.danger
  },
  error: {
    fontSize: 12,
    color: theme.danger,
    marginTop: 6
  }
})

