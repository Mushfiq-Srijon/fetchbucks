<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPassword;
use App\Mail\VerifyEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $token = Str::random(64);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verification_token' => $token,
        ]);

        $verificationUrl = env('FRONTEND_URL') . '/verify-email?token=' . $token . '&email=' . urlencode($user->email);

        Mail::to($user->email)->send(new VerifyEmail($user->name, $verificationUrl));

        return response()->json([
            'message' => 'Account created! Please check your email to verify your account.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember_me' => 'boolean',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user = $request->user();

        if (!$user->email_verified_at) {
            Auth::logout();
            return response()->json([
                'message' => 'Please verify your email before logging in.',
                'unverified' => true,
            ], 403);
        }

        $remember = $request->boolean('remember_me', false);
        $expiry = $remember ? now()->addDays(30) : now()->addDay();
        $token = $user->createToken('auth_token', ['*'], $expiry)->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)
            ->where('email_verification_token', $request->token)
            ->first();

        if (!$user) {
            // Token already cleared — check if already verified
            $userByEmail = User::where('email', $request->email)->first();
            if ($userByEmail && $userByEmail->email_verified_at) {
                return response()->json(['message' => 'Email already verified.'], 200);
            }
            return response()->json(['message' => 'Invalid or expired verification link.'], 400);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        $user->update([
            'email_verified_at' => now(),
            'email_verification_token' => null,
        ]);

        return response()->json(['message' => 'Email verified successfully! You can now log in.']);
    }

    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->email_verified_at) {
            return response()->json(['message' => 'If that email exists and is unverified, a link has been sent.']);
        }

        $token = Str::random(64);
        $user->update(['email_verification_token' => $token]);

        $verificationUrl = env('FRONTEND_URL') . '/verify-email?token=' . $token . '&email=' . urlencode($user->email);
        Mail::to($user->email)->send(new VerifyEmail($user->name, $verificationUrl));

        return response()->json(['message' => 'If that email exists and is unverified, a link has been sent.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);
            $user->update([
                'password_reset_token' => $token,
                'password_reset_expires_at' => now()->addHour(),
            ]);

            $resetUrl = env('FRONTEND_URL') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
            Mail::to($user->email)->send(new ResetPassword($user->name, $resetUrl));
        }

        return response()->json(['message' => 'If that email exists, a reset link has been sent.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)
            ->where('password_reset_token', $request->token)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired reset link.'], 400);
        }

        if ($user->password_reset_expires_at < now()) {
            return response()->json(['message' => 'This reset link has expired. Please request a new one.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_expires_at' => null,
        ]);

        $user->tokens()->delete();

        return response()->json(['message' => 'Password reset successfully! You can now log in.']);
    }
}