/* eslint-disable @typescript-eslint/no-require-imports */
"use server"
import { NextResponse } from "next/server";
import mongoosedb from "@/app/lib/db/db";

import User from "@/app/lib/models/User";
import Role from "@/app/lib/models/Role";
import Notification from "@/app/lib/models/Notification";
import * as yup from "yup";
import bcrypt from "bcrypt";

const registrationSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters').max(15, 'Username must be at most 20 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const POST = async (req) => {
  try {
    const dataReq = await req.json();
    await mongoosedb();
    await registrationSchema.validate(dataReq);

    const email = dataReq.email.toLowerCase();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return new NextResponse(JSON.stringify({ success: false, message: "Email already exists" }));
    }

    const existingUsername = await User.findOne({ username: dataReq.username });
    if (existingUsername) {
      return new NextResponse(JSON.stringify({ success: false, message: "Username already exists" }));
    }

    const defaultRole = await Role.findOne({ isDefault: true });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dataReq.password, salt);

    const newUser = await User.create({
      username: dataReq.username,
      email,
      password: hash,
      role: defaultRole?._id,
    });

    await Notification.create({
      user: newUser._id,
      type: "system",
      message: "Welcome to the forum! Glad to have you here — head over to the boards and introduce yourself.",
    });

    return new NextResponse(JSON.stringify({ message: "Account created", success: true }));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ message: "Error", success: false }));
  }
};