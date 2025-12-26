import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { loginSuccess, setError, setLoading } from '../../store/authSlice';
import Textbox, { FormikTextbox } from '../../components/common/Textbox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddModeratorIcon from '@mui/icons-material/AddModerator';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required')
});

const renderError = (message: string) => <div className="field-error">{message}</div>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { error, user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, token, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--one" />
      <div className="auth-orb auth-orb--two" />

      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-top">
            <div className="logo-mark logo-mark--lg">
              <span>CL</span>
            </div>
            <div>
              <div className="eyebrow">Classified access</div>
              <h1 className="visual-title">Secure sign-in built for teams</h1>
              <p className="muted invert">
                Stay close to approvals, audits, and insights without slowing down your day.
              </p>
            </div>
          </div>
          <div className="pill-row">
            <span className="pill">SSO ready</span>
            <span className="pill">MFA aware</span>
            <span className="pill">Audit trails</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Uptime</div>
              <div className="stat-value">99.9%</div>
            </div>
            <div className="stat-divider" />
            <div>
              <div className="stat-label">Avg. sign-in</div>
              <div className="stat-value">2.3s</div>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="panel-header">
            <div className="logo-mark">
              <span>CL</span>
            </div>
            <div>
              <div className="eyebrow">Welcome back</div>
              <h2 className="panel-title">Sign in to your workspace</h2>
              <p className="muted">Use your credentials to access the console.</p>
            </div>
          </div>

          {error && (
            <div className="banner banner--error" role="alert">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async values => {
              console.log('Submitting', values);
              dispatch(setLoading(true));
              try {
                const { data } = await api.post('/auth/login', values);
                dispatch(loginSuccess({ token: data.access_token, user: data.user }));
                navigate(from, { replace: true });
              } catch (err: any) {
                const message = err?.response?.data?.message || 'Login failed';
                dispatch(setError(message));
              } finally {
                dispatch(setLoading(false));
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => {
              const emailHasError = touched.email && !!errors.email;
              const passwordHasError = touched.password && !!errors.password;

              return (
              <Form className="auth-form" noValidate>
                
                <FormikTextbox
                  id="email"
                      name="email"
                      type="email"
                      label="Email address"
                      placeholder="you@example.com"
                      leftIcon={<AddModeratorIcon />}
                    />

                 <FormikTextbox
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="admin123"
                      showPasswordToggle
                      leftIcon={<AdminPanelSettingsIcon />}
                    />
              
                <button className="btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="auth-actions">
                  <span className="muted">Need an account?</span>
                  <Link to="/register">Create one</Link>
                </div>
              </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
