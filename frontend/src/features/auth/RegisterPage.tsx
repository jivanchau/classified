import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required')
});

const renderError = (message: string) => <div style={{ color: 'crimson' }}>{message}</div>;

export default function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div className="app-main">
      <div className="card" style={{ maxWidth: 420, margin: '2rem auto' }}>
        <h2>Register</h2>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async values => {
            await api.post('/auth/register', values);
            navigate('/login');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form-grid">
              <label>
                <div>Name</div>
                <Field name="name" placeholder="Full name" />
                <ErrorMessage name="name" render={renderError} />
              </label>
              <label>
                <div>Email</div>
                <Field name="email" type="email" placeholder="you@example.com" />
                <ErrorMessage name="email" render={renderError} />
              </label>
              <label>
                <div>Password</div>
                <Field name="password" type="password" placeholder="••••••••" />
                <ErrorMessage name="password" render={renderError} />
              </label>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create account'}
              </button>
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
