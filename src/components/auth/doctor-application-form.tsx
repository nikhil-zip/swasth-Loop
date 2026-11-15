"use client";

import { useActionState } from "react";
import { submitDoctorApplicationAction } from "@/app/actions/doctor-application";

type SpecialtyOption = { id: string; name: string };

export function DoctorApplicationForm({
  specialties,
  enabled,
}: {
  specialties: SpecialtyOption[];
  enabled: boolean;
}) {
  const [state, action, pending] = useActionState(submitDoctorApplicationAction, null);
  const ready = enabled && specialties.length > 0;

  return (
    <form action={action} className="auth-form application-form">
      <p className="auth-form-note">
        Applications are reviewed by Swasthloop. A doctor profile is not created or made public until approval.
        Do not include patient or medical-record information.
      </p>
      <div className="field-group">
        <label htmlFor="application-specialty">Specialty</label>
        <select className="form-input" id="application-specialty" name="specialtyId" required>
          <option value="">Select a specialty</option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="field-group">
          <label htmlFor="registration-authority">Registration council / authority</label>
          <input
            className="form-input"
            id="registration-authority"
            maxLength={200}
            minLength={2}
            name="registrationAuthority"
            required
            type="text"
          />
        </div>
        <div className="field-group">
          <label htmlFor="registration-number">Registration number</label>
          <input
            className="form-input"
            id="registration-number"
            maxLength={100}
            minLength={2}
            name="registrationNumber"
            required
            type="text"
          />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="application-qualifications">Qualifications</label>
        <textarea
          className="form-input form-textarea"
          id="application-qualifications"
          maxLength={2000}
          minLength={2}
          name="qualifications"
          required
          rows={4}
        />
      </div>
      <div className="field-group">
        <label htmlFor="application-experience">Years of experience</label>
        <input
          className="form-input form-experience"
          id="application-experience"
          max={70}
          min={0}
          name="yearsExperience"
          required
          type="number"
        />
      </div>
      {state && (
        <p className={`form-message form-message-${state.status}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}
      {!enabled && (
        <p className="form-message form-message-error" role="status">
          Account services are not configured for this deployment yet.
        </p>
      )}
      {enabled && specialties.length === 0 && (
        <p className="form-message form-message-info" role="status">
          Applications are not open yet because no specialties have been enabled. Please check back later.
        </p>
      )}
      <button className="button button-primary auth-submit" disabled={!ready || pending} type="submit">
        {pending ? "Submitting application…" : "Submit for review"}
      </button>
    </form>
  );
}
