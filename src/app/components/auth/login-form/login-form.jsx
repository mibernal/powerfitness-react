// login-form.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const onSubmit = async (data) => {
    const { email, password } = data;
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
          setIsUserRegistered(false);
          showUserNotRegisteredError();
        } else {
          redirectToUserPanel();
        }
      } catch (error) {
        handleAuthenticationError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSignUp = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
    } catch (error) {
      handleAuthenticationError(error);
    }
  };

  const googleLogin = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        redirectToUserPanel();
      } catch (error) {
        handleAuthenticationError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const facebookLogin = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const provider = new FacebookAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        redirectToUserPanel();
      } catch (error) {
        handleAuthenticationError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const redirectToUserPanel = () => {
    navigate('/user-panel');
  };

  const redirectToRegistration = () => {
    navigate('/registration-form');
  };

  const showUserNotRegisteredError = () => {
    alert('El usuario no está registrado. Regístrate antes de iniciar sesión.');
    redirectToRegistration();
  };

  const handleAuthenticationError = (error) => {
    if (error.code === 'auth/wrong-password') {
      alert('Contraseña incorrecta. Por favor, verifica tus credenciales.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log('Autenticación cancelada por el usuario');
    } else {
      console.error('Error en el inicio de sesión:', error);
      alert('Error en el inicio de sesión');
    }
  };

  return (
    <div className="form-container">
      <h1>Formulario de Ingreso</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Se requiere un Email.", pattern: { value: /^\S+@\S+$/i, message: "Formato Inválido." } })}
          />
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Es necesaria una Contraseña." })}
          />
          {errors.password && <div className="error">{errors.password.message}</div>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
        </button>
        <button type="button" onClick={handleSubmit(handleSignUp)} disabled={isSubmitting}>
        Registrarse
        </button>
        <hr />
        <button type="button" onClick={googleLogin} disabled={isSubmitting}>
          Ingresar con Google
        </button>
        <button type="button" onClick={facebookLogin} disabled={isSubmitting}>
          Ingresar con Facebook
        </button>
      </form>

      {!isUserRegistered && (
        <div className="error-message">
          No se permite el inicio de sesión. Por favor, regístrate antes de iniciar sesión.
          <button onClick={redirectToRegistration}>Regístrate aquí</button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
