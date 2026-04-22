import { useState } from "react";
import { Icon } from "../components/icon";
import { EditSheet } from "../components/edit-sheet";
import { BusinessForm } from "../components/business-form";
import { ApplicantForm } from "../components/applicant-form";
import { StepDots } from "../components/step-dots";
import {
  businessTypeOptions,
  formatPhoneDisplay,
  maskTaxId,
  type Applicant,
  type Business,
  type Merchant,
} from "../data/merchant";

interface ReviewProps {
  merchant: Merchant;
  onUpdateBusiness: (business: Business) => void;
  onUpdateApplicant: (applicant: Applicant) => void;
  onBack: () => void;
  onContinue: () => void;
}

type EditingTarget = "business" | "applicant" | null;

export function Review({
  merchant,
  onUpdateBusiness,
  onUpdateApplicant,
  onBack,
  onContinue,
}: ReviewProps) {
  const [editing, setEditing] = useState<EditingTarget>(null);

  const { business, applicant, externalBank } = merchant;

  const businessTypeLabel =
    businessTypeOptions.find((o) => o.value === business.businessType)?.label ||
    business.businessType;

  const businessAddress = [
    business.address.street,
    business.address.city,
    [business.address.state, business.address.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const applicantName = [applicant.firstName, applicant.middleName, applicant.lastName]
    .filter(Boolean)
    .join(" ");
  const ownershipPct = applicant.ownershipFraction
    ? `${Math.round(applicant.ownershipFraction * 100)}%`
    : null;
  const applicantSubtitle = [applicant.title, ownershipPct ? `${ownershipPct} owner` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="Chevron left" size={22} />
        </button>
        <StepDots current={0} total={3} label="Review" />
        <span style={{ width: 36 }} />
      </div>

      <div className="screen-body stack-lg">
        <div>
          <h1 className="heading-600" style={{ margin: 0, letterSpacing: "-0.01em" }}>
            Let's confirm your details.
          </h1>
          <p className="body-400 muted" style={{ margin: "6px 0 0" }}>
            We pulled this from another application. Tap any row to edit.
          </p>
        </div>

        <Row
          icon="Office building"
          title={business.doingBusinessAs || business.legalName}
          subtitle={`${businessTypeLabel} · ${business.taxIdType} ${maskTaxId(
            business.taxId,
            business.taxIdType,
          )}`}
          meta={businessAddress}
          onClick={() => setEditing("business")}
        />
        <Row
          icon="User"
          title={applicantName}
          subtitle={applicantSubtitle}
          meta={`${applicant.taxIdType} ${maskTaxId(applicant.taxId, applicant.taxIdType)} · ${formatPhoneDisplay(applicant.phone)}`}
          onClick={() => setEditing("applicant")}
        />
        <Row
          icon="Library"
          title={externalBank.name}
          subtitle={`Linked account ${externalBank.mask}`}
          meta="Used for outgoing transfers"
        />

        <div className="notice">
          <Icon name="Lock closed" size={16} color="rgb(var(--neutral-600))" />
          <span className="body-200 muted-strong">Encrypted end to end.</span>
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary" onClick={onContinue}>
          Looks right, continue
          <Icon name="Arrow right" size={18} />
        </button>
      </div>

      <EditSheet
        open={editing === "business"}
        eyebrow="Business object"
        title="Edit business details"
        onClose={() => setEditing(null)}
      >
        <BusinessForm
          value={business}
          onSave={(next) => {
            onUpdateBusiness(next);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      </EditSheet>

      <EditSheet
        open={editing === "applicant"}
        eyebrow="Applicant · primary owner"
        title="Edit owner details"
        onClose={() => setEditing(null)}
      >
        <ApplicantForm
          value={applicant}
          onSave={(next) => {
            onUpdateApplicant(next);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      </EditSheet>
    </div>
  );
}

interface RowProps {
  icon: string;
  title: string;
  subtitle: string;
  meta: string;
  onClick?: () => void;
}

function Row({ icon, title, subtitle, meta, onClick }: RowProps) {
  return (
    <button className="review-row" type="button" onClick={onClick} disabled={!onClick}>
      <div className="review-row-icon">
        <Icon name={icon} size={20} />
      </div>
      <div className="review-row-body">
        <div className="heading-300" style={{ lineHeight: 1.25 }}>
          {title}
        </div>
        <div className="body-400 muted-strong" style={{ marginTop: 2 }}>
          {subtitle}
        </div>
        <div className="body-200 muted" style={{ marginTop: 4 }}>
          {meta}
        </div>
      </div>
      {onClick && <Icon name="Chevron right" size={18} color="rgb(var(--neutral-500))" />}
    </button>
  );
}

