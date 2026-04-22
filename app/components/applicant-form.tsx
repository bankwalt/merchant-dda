import { useState } from "react";
import { Icon } from "./icon";
import { Field, ReadonlyRow, Section, TextInput } from "./form-fields";
import { SupportSheet } from "./support-sheet";
import {
  formatPhoneDisplay,
  maskTaxId,
  validateEmail,
  validatePhone,
  type Applicant,
} from "../data/merchant";

interface ApplicantFormProps {
  value: Applicant;
  onSave: (next: Applicant) => void;
  onCancel: () => void;
}

export function ApplicantForm({ value, onSave, onCancel }: ApplicantFormProps) {
  const [draft, setDraft] = useState({
    phone: value.phone,
    email: value.email,
  });
  const set = <K extends keyof typeof draft>(key: K, v: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const fullName = [value.firstName, value.middleName, value.lastName].filter(Boolean).join(" ");
  const addressLine1 = [value.address.street, value.address.street2].filter(Boolean).join(", ");
  const addressLine2 = `${value.address.city}, ${value.address.state} ${value.address.zip}`;
  const ownershipPct =
    value.ownershipFraction != null ? `${Math.round(value.ownershipFraction * 100)}%` : "";
  const dirty = draft.phone !== value.phone || draft.email !== value.email;
  const [supportOpen, setSupportOpen] = useState(false);
  const phoneError = draft.phone ? validatePhone(draft.phone) : null;
  const emailError = draft.email ? validateEmail(draft.email) : null;
  const canSave = dirty && !phoneError && !emailError;

  return (
    <>
      <div className="sheet-body sheet-body-form">
        <div className="form-lock-notice">
          <Icon name="Lock closed" size={14} color="rgb(var(--neutral-600))" />
          <span className="body-200 muted-strong">
            Identity details are locked for security. Update your cell or email below.
          </span>
        </div>

        <form
          className="form stack-lg"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...value, ...draft });
          }}
        >
          <Section title="Owner">
            <ReadonlyRow label="Full name" value={fullName} />
            <ReadonlyRow label="Title" value={value.title} />
            <ReadonlyRow label="Ownership" value={ownershipPct} />
          </Section>

          <Section title="Personal information">
            <ReadonlyRow label="Date of birth" value={formatDate(value.birthdayDate)} />
            <ReadonlyRow
              label={value.taxIdType === "SSN" ? "SSN" : "ITIN"}
              value={maskTaxId(value.taxId, value.taxIdType)}
              hint="Masked for your security"
            />
          </Section>

          <Section title="Home address">
            <ReadonlyRow label="Street" value={addressLine1} />
            <ReadonlyRow label="City, state, ZIP" value={addressLine2} />
          </Section>

          <Section title="Contact">
            <Field
              label="Cell phone"
              hint="We'll text login codes here"
              error={phoneError ?? undefined}
            >
              <TextInput
                type="tel"
                value={draft.phone}
                onChange={(v) => set("phone", v)}
                inputMode="tel"
                autoComplete="tel"
              />
              {!phoneError && <PhoneHint value={draft.phone} />}
            </Field>
            <Field
              label="Email"
              hint="For account notices and receipts"
              error={emailError ?? undefined}
            >
              <TextInput
                type="email"
                value={draft.email}
                onChange={(v) => set("email", v)}
                inputMode="email"
                autoComplete="email"
              />
            </Field>
          </Section>

          <button type="button" className="support-link" onClick={() => setSupportOpen(true)}>
            Name, address, or tax ID wrong? Contact support
            <Icon name="Arrow right" size={14} color="rgb(var(--primary-700))" />
          </button>
        </form>
      </div>
      <SupportSheet
        open={supportOpen}
        reason="Update locked identity details"
        onClose={() => setSupportOpen(false)}
      />
      <div className="sheet-footer">
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSave({ ...value, ...draft })}
            disabled={!canSave}
          >
            Save changes
            <Icon name="Check" size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

function PhoneHint({ value }: { value: string }) {
  const formatted = formatPhoneDisplay(value);
  if (!formatted || formatted === value) return null;
  return (
    <span className="body-200 muted" style={{ marginTop: 4 }}>
      {formatted}
    </span>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}
