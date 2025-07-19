const { UserModel } = require('../model');
const bcrypt = require('bcrypt');

/**
 * User Controller - Handles all user-related operations
 */
class UserController {
  /**
   * Get all users (Admin only)
   * GET /api/users
   */
  static getAllUsers(req, res) {
    UserModel.getAll((err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching users',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Users fetched successfully',
        data: users,
        count: users.length
      });
    });
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  static getUserById(req, res) {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    UserModel.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching user',
          error: err.message
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'User fetched successfully',
        data: userWithoutPassword
      });
    });
  }

  /**
   * Register a new user
   * POST /api/users/register
   */
  static async registerUser(req, res) {
    const {
      username,
      email,
      password,
      full_name,
      phone,
      license_number
    } = req.body;

    // Validation
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: username, email, password, full_name'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    try {
      // Check if user already exists
      UserModel.findByEmail(email, async (err, existingUser) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error checking existing user',
            error: err.message
          });
        }

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'User with this email already exists'
          });
        }

        try {
          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          const userData = {
            username,
            email,
            password: hashedPassword,
            full_name,
            phone,
            license_number,
            role: 'customer'
          };

          UserModel.create(userData, (createErr, userId) => {
            if (createErr) {
              if (createErr.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({
                  success: false,
                  message: 'Username or email already exists'
                });
              }

              return res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: createErr.message
              });
            }

            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              data: {
                id: userId,
                username,
                email,
                full_name,
                phone,
                license_number,
                role: 'customer'
              }
            });
          });
        } catch (hashError) {
          return res.status(500).json({
            success: false,
            message: 'Error processing password',
            error: hashError.message
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  /**
   * User login
   * POST /api/users/login
   */
  static loginUser(req, res) {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    UserModel.findByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error during login',
          error: err.message
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      try {
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        // Remove password from response
        const { password: userPassword, ...userWithoutPassword } = user;

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: userWithoutPassword
          }
        });
      } catch (compareError) {
        return res.status(500).json({
          success: false,
          message: 'Error during login',
          error: compareError.message
        });
      }
    });
  }

  /**
   * Update user profile
   * PUT /api/users/:id
   */
  static updateUser(req, res) {
    const userId = req.params.id;
    const updateData = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    // Remove sensitive fields that shouldn't be updated through this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.id;

    // Validate email if it's being updated
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    UserModel.update(userId, updateData, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({
            success: false,
            message: 'Username or email already exists'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Error updating user',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    });
  }

  /**
   * Change user password
   * POST /api/users/:id/change-password
   */
  static async changePassword(req, res) {
    const userId = req.params.id;
    const { current_password, new_password } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    try {
      UserModel.findById(userId, async (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: err.message
          });
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        try {
          // Verify current password
          const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password);

          if (!isCurrentPasswordValid) {
            return res.status(401).json({
              success: false,
              message: 'Current password is incorrect'
            });
          }

          // Hash new password
          const hashedNewPassword = await bcrypt.hash(new_password, 10);

          UserModel.update(userId, { password: hashedNewPassword }, (updateErr) => {
            if (updateErr) {
              return res.status(500).json({
                success: false,
                message: 'Error updating password',
                error: updateErr.message
              });
            }

            res.json({
              success: true,
              message: 'Password changed successfully'
            });
          });
        } catch (compareError) {
          return res.status(500).json({
            success: false,
            message: 'Error processing password change',
            error: compareError.message
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Password change failed',
        error: error.message
      });
    }
  }

  /**
   * Admin login (separate endpoint for admin users)
   * POST /api/users/admin/login
   */
  static adminLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    UserModel.findByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error during admin login',
          error: err.message
        });
      }

      if (!user || user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        });
      }

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
          });
        }

        const { password: userPassword, ...adminWithoutPassword } = user;

        res.json({
          success: true,
          message: 'Admin login successful',
          data: {
            admin: adminWithoutPassword
          }
        });
      } catch (compareError) {
        return res.status(500).json({
          success: false,
          message: 'Error during admin login',
          error: compareError.message
        });
      }
    });
  }
}

module.exports = UserController;
