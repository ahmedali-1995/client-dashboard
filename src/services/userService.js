import users from '../../users.json'

class UserService {
  validateCredentials(username, password) {
    try {
      console.log('[UserService] Validating credentials...')
      
      // First find user by username
      const user = users.users.find(u => 
        u.username.toLowerCase() === username.toLowerCase()
      )
      
      if (!user) {
        console.log('[UserService] User not found:', username)
        return {
          success: false,
          error: 'Invalid username or password'
        }
      }

      // Then check password
      if (password !== user.password) {
        console.log('[UserService] Invalid password for user:', username)
        return {
          success: false,
          error: 'Invalid username or password'
        }
      }

      console.log('[UserService] Login successful for user:', username)
      return {
        success: true,
        user: {
          username: user.username,
          name: user.name,
          role: user.role
        }
      }
    } catch (error) {
      console.error('[UserService] Validation error:', error)
      return {
        success: false,
        error: 'Error validating credentials'
      }
    }
  }
}

export const userService = new UserService()
