import {RunAction, RunState} from '../types'

export const initialRunState: RunState = {
  status: 'idle',
  path: [],
  startedAt: null,
  elapsedMs: 0
}

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'START':
      return {
        ...initialRunState,
        status: 'running',
        startedAt: action.startedAt
      }
    case 'PAUSE':
      return {...state, status: 'paused'}
    case 'RESUME':
      return {...state, status: 'running'}
    case 'STOP':
      return {...state, status: 'stopped'}
    case 'ADD_POINT':
      return {...state, path: [...state.path, action.coord]}
    case 'TICK':
      return {...state, elapsedMs: state.elapsedMs + action.ms}
    case 'RESET':
      return initialRunState
    default:
      return state
  }
}
