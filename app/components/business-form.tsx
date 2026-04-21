import { useState } from "react";
import { Icon } from "./icon";
import { Field, ReadonlyRow, Section, TextInput } from "./form-fields";
import {
  businessTypeOptions,
  formatCurrency,
  formatPhoneDisplay,
  maskTaxId,
  type Business,
} from "../data/merchant";

interface BusinessFormProps {
  value: Business;
  onSave: (next: Business) => void;
  onCancel: () => void;
}

export function BusinessForm({ value, onSave, onCancel }: BusinessFormProps) {
  const [draft, setDraft] = useState({
    phone: value.phone,
    email: value.email,
  });
  const set = <K extends keyof typeof draft>(key: K, v: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [key]: v }));

  const businessTypeLabel =
    businessTypeOptions.find((o) => o.value === value.businessType)?.label || value.businessType;
  const addressLine1 = [value.address.street, value.address.street2].filter(Boolean).join(", ");
  const addressLine2 = `${value.address.city}, ${value.address.state} ${value.address.zip}`;
  const dirty = draft.phone !== value.phone || draft.email !== value.email;

  return (
    <>
      <div className="sheet-body sheet-body-form">
        <div className="form-lock-notice">
          <Icon name="Lock closed" size={14} color="rgb(var(--neutral-600))" />
          <span className="body-200 muted-strong">
            Locked details came from your earlier application. Update email or phone to change how
            we reach you.
          </span>
        </div>

        <form
          className="form stack-lg"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...value, ...draft });
          }}
        >
          <Section title="Business identity">
            <ReadonlyRow label="Legal business name" value={value.legalName} />
            <ReadonlyRow label="Doing business as" value={value.doingBusinessAs} />
            <ReadonlyRow label="Business structure" value={businessTypeLabel} />
            <ReadonlyRow label="Business start date" value={formatDate(value.establishmentDate)} />
          </Section>

          <Section title="Tax information">
            <ReadonlyRow
              label={value.taxIdType === "EIN" ? "EIN" : "SSN"}
              value={maskTaxId(value.taxId, value.taxIdType)}
              hint="Masked for your security"
            />
          </Section>

          <Section title="Business address">
            <ReadonlyRow label="Street" value={addressLine1} />
            <ReadonlyRow label="City, state, ZIP" value={addressLine2} />
          </Section>

          <Section title="Contact">
            <Field label="Business phone" hint="We'll text a verification code here">
              <TextInput
                type="tel"
                value={draft.phone}
                onChange={(v) => set("phone", v)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 415 555 1234"
              />
              <PhoneHint value={draft.phone} />
            </Field>
            <Field label="Business email" hint="For statements and account notices">
              <TextInput
                type="email"
                value={draft.email}
                onChange={(v) => set("email", v)}
                inputMode="email"
                autoComplete="email"
              />
            </Field>
          </Section>

          <Section title="Processing">
            <ReadonlyRow label="Merchant category (MCC)" value={value.mcc} />
            <ReadonlyRow
              label="Annual processing volume"
              value={formatCurrency(value.annualProcessingVolume)}
            />
            <ReadonlyRow
              label="Average transaction"
              value={formatCurrency(value.averageTransactionValue)}
            />
            <ReadonlyRow label="Statement descriptor" value={value.statementDescriptor} />
            <ReadonlyRow label="Website" value={value.websiteUrl} />
          </Section>
        </form>
      </div>
      <div className="sheet-footer">
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSave({ ...value, ...draft })}
            disabled={!dirty}
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
