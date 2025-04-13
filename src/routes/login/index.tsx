import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography, message, Spin } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const { Title } = Typography;

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    document.title = "Login • Incubation Platform";
  }, []);

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let redirectPath = "/dashboard";
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on role
        if (role === 'Admin') {
          redirectPath = "/admin";
        } else if (role === 'Director') {
          redirectPath = "/director";
        } else if (role === 'Operations') {
          redirectPath = "/dashboard"; // Operations dashboard
        } else if (role === 'Incubatee' || role === 'Funder' || role === 'Consultant') {
          redirectPath = "/"; // Default dashboard
        }
      }

      message.success("🎉 Login successful! Redirecting...", 2);
      setRedirecting(true);

      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (error: any) {
      console.error(error);
      message.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let redirectPath = "/";
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on role
        if (role === 'Admin') {
          redirectPath = "/admin";
        } else if (role === 'Director') {
          redirectPath = "/director";
        } else if (role === 'Operations') {
          redirectPath = "/dashboard"; // Operations dashboard
        } else if (role === 'Incubatee' || role === 'Funder' || role === 'Consultant') {
          redirectPath = "/"; // Default dashboard
        }
      }

      message.success("✅ Google login successful! Redirecting...", 2);
      setRedirecting(true);

      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (error: any) {
      console.error(error);
      message.error("Google login failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Spin spinning={loading || googleLoading || redirecting} size='large'>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          backgroundImage: `url("/assets/images/bg-image.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "fadeIn 0.7s ease-in-out",
          position: "relative",
        }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <ThemedTitleV2
            collapsed={false}
            text={
              <span
                style={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: 1,
                }}
              >
                Incubation System
              </span>
            }
          />
        </div>

        <div
          style={{
            maxWidth: 400,
            width: "100%",
            padding: "48px 32px",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            background: "#ffffffee",
            animation: "fadeInUp 0.6s ease-out",
            backdropFilter: "blur(5px)",
          }}
        >
          <Form
            layout='vertical'
            form={form}
            onFinish={handleLogin}
            requiredMark={false}
          >
            <Title
              level={4}
              style={{ textAlign: "center", marginTop: 16, color: "#1677ff" }}
            >
              Welcome back
            </Title>

            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder='you@example.com' />
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder='Enter your password'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' block loading={loading}>
                Log In
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                icon={<GoogleOutlined />}
                onClick={handleGoogleLogin}
                style={{ width: "100%" }}
                loading={googleLoading}
              >
                Login with Google
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/register")}
              style={{ fontWeight: 500 }}
            >
              Register
            </a>
          </div>
        </div>

        {/* Floating Quantilytix logo */}
        <img
          src='/assets/images/QuantilytixO.png'
          alt='Quantilytix Logo'
          style={{
            position: "absolute",
            bottom: 24,
            right: 15,
            height: 50,
            opacity: 0.9,
          }}
        />
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Spin>
  );
};
