import jwt from 'jsonwebtoken'
import { User, IUser } from './auth.model'

interface RegisterInput{
    name: string
    email: string
    password: string
}

interface LoginInput{
    email: string
    password: string
}

interface AuthResult{
    user: {
        _id: string
        name: string
        email: string
    }
    token: string
}

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET!
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions)
}

export const register = async (input: RegisterInput): Promise<AuthResult> => {
    const existingUser = await User.findOne({ email: input.email })
    if (existingUser) {
        throw new Error('Email is already in use')
    }

    const user = await User.create({
        name: input.name,
        email: input.email,
        password: input.password
    })

    const token = generateToken(user.id)

    return {
        user: {
            _id: user.id,
            name: user.name,
            email: user.email
        },
        token
    }
}

export const login = async (input: LoginInput): Promise<AuthResult> => {
    const user = await User.findOne({ email: input.email })
    if (!user) {
        throw new Error('Invalid email or password')
    }

    const isPasswordValid = await user.comparePassword(input.password)
    if (!isPasswordValid) {
        throw new Error('Invalid email or password')
    }

    const token = generateToken(user.id)

    return {
        user: {
            _id: user.id,
            name: user.name,
            email: user.email
        },
        token
    }
}

export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password')
    if (!user) {
        throw new Error('User not found')
    }
    return user
}

export const updateFcmToken = async (userId: string, fcmToken: string) => {
    const user = await User.findOneAndUpdate(
        { _id: userId }, 
        { $set: { fcmToken: fcmToken } },
        { new: true }
    )
    return user
}