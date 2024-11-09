// src/app/components/auth/registration-form/registration-form.jsx
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../../../../environments/firebaseConfig';

const RegistrationForm = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Es necesario un Nombre'),
    lastName: Yup.string().required('Es necesario un Apellido'),
    email: Yup.string().email('Formato inválido').required('Es necesario un Email'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Es necesaria una Contraseña'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const { firstName, lastName, email, password } = values;
    
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        setFieldError('email', 'Correo Electronico Ya Existe');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName,
        lastName,
        email,
      });

      navigate('/user-panel');
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyAndRegisterWithExternalProvider = async (email, uid, displayName, photoURL) => {
    const [firstName, lastName] = displayName?.split(' ') || ['', ''];
    
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        alert('Correo Electronico Ya Existe');
        return;
      }

      await setDoc(doc(firestore, 'users', uid), {
        firstName,
        lastName,
        email,
        photoURL: photoURL || '',
        password: null,
      });

      navigate('/user-panel');
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Error al crear usuario');
    }
  };

  const registerWithGoogle = () => {
    if (isPopupOpen) return;

    setIsPopupOpen(true);
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        verifyAndRegisterWithExternalProvider(user.email, user.uid, user.displayName, user.photoURL);
      })
      .catch((error) => {
        console.error('Error al registrar con Google:', error);
        alert('Error al registrar con Google');
      })
      .finally(() => setIsPopupOpen(false));
  };

  const registerWithFacebook = () => {
    if (isPopupOpen) return;

    setIsPopupOpen(true);
    const provider = new FacebookAuthProvider();
    
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        verifyAndRegisterWithExternalProvider(user.email, user.uid, user.displayName, user.photoURL);
      })
      .catch((error) => {
        console.error('Error al registrar con Facebook:', error);
        alert('Error al registrar con Facebook');
      })
      .finally(() => setIsPopupOpen(false));
  };

  return (
    <div className="form-container">
      <h1>Formulario de Registro</h1>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="firstName">Nombres:</label>
              <Field type="text" id="firstName" name="firstName" />
              <ErrorMessage name="firstName" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="lastName">Apellidos:</label>
              <Field type="text" id="lastName" name="lastName" />
              <ErrorMessage name="lastName" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="password">Contraseña:</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div>
              <button type="submit" disabled={isSubmitting}>
                Registrar
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div>
        <button onClick={registerWithGoogle}>Registrar con Google</button>
        <button onClick={registerWithFacebook}>Registrar con Facebook</button>
      </div>
    </div>
  );
};

export default RegistrationForm;
