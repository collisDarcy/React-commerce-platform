import { USER_LOGIN, USER_LOGOUT, LOGIN_SUCCESS, LOGIN_FAILED, LOGIN_INFO } from './actionTypes'


const defaultState = {
  isLogin: false,
  username: null
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        isLogin: action.flag,
        username: action.username
      }
    case LOGIN_SUCCESS:
      return {
        isLogin: action.flag,
        username: action.username
      }
    case LOGIN_FAILED:
      return state;
    case USER_LOGOUT:
      return {
        ...state,
        isLogin: action.flag
      }
    case LOGIN_INFO:
      return {
        username: action.username
      }
    default:
      return state;
  }
}







