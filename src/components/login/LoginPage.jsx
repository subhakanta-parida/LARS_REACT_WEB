'use client';

import { Button, Select, TextInput } from '@manulife/mux';
import { Login1 } from '@manulife/mux-cds-icons';
import { Manulife } from '@manulife/mux-logos';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';
import { useLogin } from 'src/state/login/LoginContext';

export const roles = [
  { id: 'analyst', label: 'Analyst' },
  { id: 'administrator', label: 'Administrator' },
  { id: 'read-only', label: 'Read only' },
];

export default function LoginPage() {
  const { state, dispatch } = useLogin();
  const [showHelp, setShowHelp] = useState(false);
  const { control, register, handleSubmit, reset, setValue, setFocus, formState: { isSubmitting } } = useForm({
    defaultValues: { userId: '', password: '', role: '', remember: false },
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lars.userId');
      if (saved) {
        setValue('userId', saved);
        setValue('remember', true);
      }
    } catch {}
  }, [setValue]);

  async function onSubmit(values) {
    dispatch({ type: 'submit' });
    try {
      if (values.remember) localStorage.setItem('lars.userId', values.userId.trim());
      else localStorage.removeItem('lars.userId');
    } catch {}

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ userId: values.userId.trim(), password: values.password, role: values.role }),
      });
      if (response.status === 503) {
        dispatch({ type: 'failure', message: 'LARS sign-in is not configured yet. Contact your LARS administrator.' });
      } else {
        dispatch({ type: 'failure', message: 'Unable to sign in. Contact your LARS administrator for assistance.' });
      }
    } catch {
      dispatch({ type: 'failure', message: 'Unable to connect to LARS. Check your connection and try again.' });
    } finally {
      setValue('password', '');
    }
  }

  function cancel() {
    reset({ userId: '', password: '', role: '', remember: false });
    dispatch({ type: 'reset' });
    try { localStorage.removeItem('lars.userId'); } catch {}
    setFocus('userId');
  }

  return (
    <div className="min-h-dvh">
      <a className="fixed -top-[100px] left-4 z-20 bg-white px-5 py-3 text-lars-green underline-offset-[5px] hover:decoration-2 focus:top-3" href="#sign-in">Skip to sign in</a>
      <Header />

      <div className="login-body">
        <aside className="brand-rail" aria-label="Manulife">
          <div className="rail-mark"><span aria-hidden="true">M</span></div>
          <span className="rail-label">LARS</span>
        </aside>
        <div className="landscape-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="landscape-image" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85" alt="Mountain peaks reflected in a tranquil alpine lake" />
          <div className="landscape-brand"><Manulife.WHITE aria-label="Manulife" /></div>
          <div className="landscape-caption"><span className="caption-rule" /><p>Confidence for<br />the road ahead.</p></div>
        </div>

        <main className="sign-in-panel" id="sign-in">
          <div className="form-content">
            <div className="mobile-brand"><Manulife.COLOR aria-label="Manulife" /></div>
            <span className="product-name">LARS</span>
            <h1><em>Sign in</em> to LARS</h1>
            <p className="intro">Welcome back. Enter your Manulife credentials.</p>

            <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="LARS sign in" aria-busy={isSubmitting}>
              <fieldset disabled={isSubmitting} className="login-fields">
                <legend className="sr-only">Your sign-in details</legend>
                <Controller name="userId" control={control} rules={{ validate: (value) => !!value.trim() || 'Enter your user ID.' }} render={({ field, fieldState }) => (
                  <TextInput {...field} label="User ID" autoComplete="username" autoCapitalize="none" spellCheck={false} required errors={fieldState.error ? [fieldState.error.message] : undefined} callouts />
                )} />
                <Controller name="password" control={control} rules={{ required: 'Enter your password.' }} render={({ field, fieldState }) => (
                  <TextInput {...field} label="Password" autoComplete="current-password" isPassword required errors={fieldState.error ? [fieldState.error.message] : undefined} callouts />
                )} />
                <Controller name="role" control={control} rules={{ required: 'Select your user role.' }} render={({ field, fieldState }) => (
                  <Select name={field.name} ref={field.ref} onBlur={field.onBlur} label="User role" items={roles} selectedKey={field.value || null} onSelectionChange={field.onChange} placeholder="Select your role" required errors={fieldState.error ? [fieldState.error.message] : undefined} callouts>
                    {(item) => <Select.Item id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                  </Select>
                )} />
                <label className="remember-label"><input type="checkbox" {...register('remember')} />Remember user ID</label>
                {state.status === 'error' && <div role="alert" className="auth-error">{state.message}</div>}
                <div className="form-actions">
                  <Button type="submit" variant={Button.VARIANT.SIGN_IN} icon={<Login1 />} saving={isSubmitting} disabled={isSubmitting}>Sign in</Button>
                  <Button type="button" variant={Button.VARIANT.SECONDARY} onClick={cancel}>Cancel</Button>
                </div>
              </fieldset>
            </form>

            <div className="help-section">
              <button type="button" className="text-button" aria-expanded={showHelp} aria-controls="sign-in-help" onClick={() => setShowHelp(!showHelp)}>Need help signing in?</button>
              {showHelp && <div id="sign-in-help" className="help-content"><p>For a forgotten user ID, password reset, or role access, contact your Manulife service desk or LARS administrator.</p><p>Never share your password with support.</p></div>}
            </div>
            <p className="security-note">For authorized users only. Access to this system is monitored.</p>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}