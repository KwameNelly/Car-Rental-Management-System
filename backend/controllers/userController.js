const { UserModel } = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * User Controller - Handles all user-related operations
 */
class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Users fetched successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *                 count:
   *                   type: integer
   *                   example: 5
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: User fetched successfully
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request - invalid user ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/users/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *               - full_name
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *                 description: Unique username for the user
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: password123
   *                 description: User's password (minimum 6 characters)
   *               full_name:
   *                 type: string
   *                 example: John Doe
   *                 description: User's full name
   *               phone:
   *                 type: string
   *                 example: +1234567890
   *                 description: User's phone number
   *               license_number:
   *                 type: string
   *                 example: DL123456789
   *                 description: User's driver's license number
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     username:
   *                       type: string
   *                       example: john_doe
   *                     email:
   *                       type: string
   *                       example: john@example.com
   *                     full_name:
   *                       type: string
   *                       example: John Doe
   *                     role:
   *                       type: string
   *                       example: customer
   *       400:
   *         description: Bad request - missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - user already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/users/login:
   *   post:
   *     summary: User login
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 example: password123
   *                 description: User's password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Login successful
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request - missing credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized - invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: userWithoutPassword,
            token: token
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
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user profile
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               full_name:
   *                 type: string
   *                 example: John Doe
   *               phone:
   *                 type: string
   *                 example: +1234567890
   *               license_number:
   *                 type: string
   *                 example: DL123456789
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: User updated successfully
   *       400:
   *         description: Bad request - invalid user ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - username or email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/users/{id}/change-password:
   *   post:
   *     summary: Change user password
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - current_password
   *               - new_password
   *             properties:
   *               current_password:
   *                 type: string
   *                 example: oldpassword123
   *                 description: Current password
   *               new_password:
   *                 type: string
   *                 minLength: 6
   *                 example: newpassword123
   *                 description: New password (minimum 6 characters)
   *     responses:
   *       200:
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Password changed successfully
   *       400:
   *         description: Bad request - invalid user ID or missing fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized - current password is incorrect
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/users/admin/login:
   *   post:
   *     summary: Admin login
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@carrental.com
   *                 description: Admin email address
   *               password:
   *                 type: string
   *                 example: adminpassword123
   *                 description: Admin password
   *     responses:
   *       200:
   *         description: Admin login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Admin login successful
   *                 data:
   *                   type: object
   *                   properties:
   *                     admin:
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request - missing credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized - invalid admin credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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

        // Generate JWT token for admin
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          success: true,
          message: 'Admin login successful',
          data: {
            admin: adminWithoutPassword,
            token: token
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
