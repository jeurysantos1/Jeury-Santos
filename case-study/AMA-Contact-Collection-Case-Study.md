# AMA Contact Collection — New Contact Entry Point
### A product design case study

**Role:** Product Designer (lead) · **Surface:** AMA (Ads Manager App) + Mobile Site
**Team:** PM, Eng, Content, partner designers (Shamavi, Scott, Rohit), reviewers (Gene, Chris, Kevin)
**Status:** ✅ **Final design approved** (alignment locked with the AMA team)
**Artifacts:** Interactive prototype (ProtoHub `1515770830228340`), exploration deck, FB/IG pattern analysis, final flow board (Figma)

---

## TL;DR
Advertisers weren't reliably giving us **verified** ways to reach them, so account-critical notifications (billing, policy, performance) often never landed. I designed a **contact-collection entry point** that lives natively in AMA but reuses Meta's existing web verification stack — the native screen *holds* in place while a Facebook in-app browser slides up to handle add + verify. The work went through a full exploration → cross-functional alignment → **approved final design** cycle, with decisions grounded in platform conventions (FB/IG/iOS) and validated in a working prototype.

---

## The problem
Meta needs trustworthy contact channels (email, mobile phone, WhatsApp) to notify advertisers about things they can't afford to miss. In practice this info was often **missing, stale, or unverified**, so notifications silently failed.

The hard part wasn't the form — it was **where and how** to collect it:
- The consent + verification experience (entry, marketing opt-ins, OTP, legal copy) is **owned by a web surface ("mobile site")**, and re-building/re-certifying it natively would be expensive and slow to keep compliant.
- But advertiser **intent lives in the native app** — that's where they notice the prompt and act.

**Design question:** How do we surface the entry point natively while reusing the web verification stack, without the seam feeling broken?

---

## Goals
- **Increase verified contact coverage** across email, phone, and WhatsApp.
- **Minimize friction** from "I should add this" → "added and verified."
- **Reuse the web verification stack** (single source of truth for consent/compliance).
- **Feel native and trustworthy** — this screen asks for personal contact info.
- **Stay consistent across AMA and the Mobile Site.**

*Success signals (targets):* contact add-rate, verification completion rate, and drop-off between entry and verify.

---

## Constraints
- Verification/consent logic must stay on the **web surface** (no native fork of legal/OTP).
- Must respect the **Geo design system** and AMA's existing visual language.
- Mobile-first; small real estate; fast scanning.
- Behavior must be **consistent across AMA and the Mobile Site**.

---

## Approach — "Native add, holding" + in-app browser handoff
The core idea: the **entry point lives natively**, but the actual add/verify happens on the **mobile site rendered inside a Facebook in-app browser** that slides up over the native screen.

When the user taps a contact row, the native screen **doesn't navigate away** — it scales back slightly and **stays mounted behind** a dimmed backdrop while the in-app browser slides up. On close, the native screen is revealed exactly as it was, with its row state updated. *The native app is the durable host; the web view is a transient task surface.*

| | Pure native | Pure mobile site | **This hybrid** |
|---|---|---|---|
| Time to ship | Slow (rebuild consent/OTP) | Fast | **Fast** (reuse web) |
| Compliance upkeep | Duplicated | Single source | **Single source** |
| Discoverability | High | Low (user leaves app) | **High** |
| Continuity | Seamless | Jarring switch | **Near-seamless** |

**Why it wins:** the reuse + compliance benefits of the mobile site with the discoverability + continuity of native — without forking verification logic.

**Principles I held to:**
- Native owns the **entry + status**; web owns the **work**.
- **One verification engine, many channels** — phone/WhatsApp/email all flow through the same form → code → verify pipeline, parameterized per channel.
- **Truthful state**: `Not added → Pending confirmation → Verified`, persisting pending state even if the user bails before entering the code.

---

## Process & key decisions

### 1. Exploring the entry-point row
I explored how the contact rows should present their action, varying two independent things:
- **Affordance:** filled icon button vs. bare icon vs. labeled "Add" button.
- **Status pill:** keep an empty-state badge vs. remove it.

I wrote a designer's analysis weighing each against affordance (Norman's signifiers), Fitts's Law, consistency (Jakob's Law), redundancy/clutter, and visual balance. The team explicitly debated whether to keep a **badge on empty channels** for consistency across AMA + Mobile.

**Decision (final):** lead with an **icon-only add affordance** in a contained button, and **remove the redundant empty-state badge** (the "Option 5" direction). "None" + the add CTA already communicate empty; the **only badge kept is "Pending confirmation,"** which pulls the user back to finish what they started.

### 2. Tap-target color — blue vs. gray
AMA used a **blue** fill behind the add icon. A reviewer flagged they'd never seen blue used to signal a touch target. I grounded the debate in **FB / Instagram / iOS** conventions:
- Across these surfaces, **blue = link / action / selected**, and tappability is shown via **neutral rows + a gray pressed state** — not a blue fill.
- I documented this in a dedicated FB/IG pattern analysis and a side-by-side treatment deck (blue vs. gray vs. bare).

**Decision (final alignment):** the team chose to **keep the blue add CTA**, prioritizing **consistency with AMA's existing visual language** (championed by Chris). The pattern research did its job — the decision was made deliberately, with the platform trade-off understood, rather than as a silent default.

### 3. The verification flow (prototyped end-to-end)
I built a working prototype to pressure-test the full flow, including the details that make or break it:
- **In-app browser handoff** with the native screen holding behind a dimmed backdrop (and fixed a real bug where the backdrop overlapped and blocked interaction).
- **Per-channel forms** with channel-appropriate copy and consent (phone/WhatsApp = number + opt-ins; WhatsApp = single combined consent; email = email + marketing consent). Consent checkboxes **start unchecked** — opt-in requires explicit input.
- **Confirmation code** screen with a clear state machine:
  - Continue **disabled until a code is entered**; **loading** state on submit.
  - **Success** (`123456`): green field + check, "verified" toast, row flips to Verified.
  - **Wrong code**: red fill + slash icon + message, and Continue **disables** until the code is changed.
- **Validation states for all channels:** empty-field, invalid-format, and wrong-code, each with the standard red error treatment.
- **Channel chaining:** after verifying, Continue advances to the **next empty channel**; Skip jumps forward too.
- **Management:** a pending row re-enters its confirmation screen on tap; a 3-dot sheet offers **Get confirmation code** (resend) and **Remove channel**.
- **Settings entry point:** wired the app's gear into a full **Settings page** (Internal settings, Billing, Notifications, General → Contact Information), since the widget lives in **General Settings**.

### 4. Cross-functional alignment → final
I reviewed with the AMA team, distributed action items across partners, and drove the final alignment on the open treatment questions. The result is the **approved final design** below.

---

## Final design (approved)
The final contact-information surface refines the rows into the **Geo 2.0 list-cell pattern** and locks the treatment decisions:

- **Row hierarchy flipped** → the **channel name is bold on top**, the **value is the secondary line below** (e.g., "Mobile phone number" / "None").
- **Empty channels show just "None"** — no empty-state badge. The **only badge is "Pending confirmation"** on an added-but-unverified channel.
- **State-specific action affordance** on the right of each row:
  - **Empty** → **blue filled "+"** in a light-blue container (add).
  - **Pending** → **bare "⋮" kebab** → options sheet (Get confirmation code / Remove channel).
  - **Verified / filled** → **bare "✎" pencil** (edit).
- **Blue** is retained for the add CTA, for **consistency with AMA's visual language**.
- Tapping a channel hands off to the in-app browser (mobile site) for add + verify, then returns to the native list with state updated; verified channels chain forward until contact info is complete.
- The same treatment is applied across **AMA and the Mobile Site** for consistency.

---

## Outcome
- ✅ **Final design approved to move forward.**
- A clickable, end-to-end prototype that de-risked the flow and aligned eng + content on real behavior (not static comps).
- A reusable **pattern rationale** (FB/IG/iOS analysis) that turned the blue-vs-gray and badging debates into deliberate, documented decisions.

*Next:* finalize empty-state to **Geo 2.0** parity, keep AMA ↔ Mobile Site in lockstep, extend into the **Message Hub**, and confirm the in-line CTA status.

---

## Reflections
- **Decide the variables separately.** Splitting "tap-target color" from "badge treatment" into two clean comparisons made alignment fast — people could agree on one without relitigating the other.
- **Convention informs, the team decides.** Grounding blue-vs-gray in FB/IG/iOS precedent didn't dictate the answer (we kept blue for AMA consistency) — but it made the call deliberate and defensible.
- **Prototype the seams.** The hardest part of a hybrid native↔web flow is the handoff; building it revealed (and let me fix) issues a static mock never would.
- **Less, but meaningful, signal.** Removing the redundant empty-state badge made the one status that matters — "Pending confirmation" — actually pull attention.
