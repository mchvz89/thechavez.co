---
title: "Implementing Zero Trust with Microsoft Entra ID"
description: "A practical walkthrough of enforcing Zero Trust principles in a Microsoft 365 environment using Conditional Access, PIM, and continuous access evaluation."
pubDate: 2026-05-10
tags: ["Entra ID", "Zero Trust", "Azure", "SC-300"]
draft: false
---

Zero Trust isn't a product — it's a framework. The core premise: **never trust, always verify**. In a Microsoft 365 environment, Microsoft Entra ID is the control plane that makes Zero Trust operationally real.

## Identity as the New Perimeter

Traditional security relied on a network perimeter: if you were inside the firewall, you were trusted. That model broke down with remote work, BYOD, and SaaS apps living outside corporate infrastructure.

In a Zero Trust model, every access request is treated as potentially hostile until verified — regardless of whether it originates inside or outside the corporate network. The question shifts from *where is this request coming from?* to *who is making it, on what device, and should they have access right now?*

## Conditional Access: The Policy Engine

Conditional Access (CA) policies are the enforcement layer. A CA policy evaluates signals — user identity, device compliance state, location, application sensitivity, sign-in risk — and decides: allow, block, or require step-up authentication.

A baseline policy set I deploy on every tenant:

**1. Require MFA for all users**

The highest ROI security control. Blocks the vast majority of credential-based attacks with minimal user friction when paired with Microsoft Authenticator's number matching.

**2. Block legacy authentication**

Legacy auth protocols (IMAP, POP, SMTP AUTH, basic auth) bypass MFA entirely. With Exchange Online, you can also enforce this at the mailbox level as a belt-and-suspenders measure.

**3. Require compliant device for sensitive apps**

For apps handling sensitive data — SharePoint, Exchange, finance tooling — require Intune device compliance as a condition. An Entra-joined device with compliant status is a meaningful signal; an unknown device is not.

**4. Session controls for unmanaged devices**

When access comes from a non-managed device, scope the session: block download, restrict print and copy via Defender for Cloud Apps session policies. The user can read; they can't exfiltrate.

## Privileged Identity Management

PIM enforces just-in-time (JIT) access for privileged roles. Instead of users holding Global Administrator permanently, they activate it for a bounded time window with a justification — and the activation is logged.

Key PIM configuration steps:

1. Audit current permanent role assignments; convert to *eligible* where possible
2. Require MFA on activation for all privileged roles
3. Set maximum activation duration (2–4 hours for most administrative roles)
4. Configure an approval workflow for Global Administrator activation
5. Enable PIM alerts for suspicious patterns (permanent assignments added outside PIM, high-volume activations)

The goal is that a compromised credential alone isn't enough to do catastrophic damage. The attacker also needs to trigger MFA, get approval, and activate the role — in a window small enough that monitoring has a chance to catch it.

## Continuous Access Evaluation

Without CAE, access tokens are valid for up to 1 hour regardless of what happens after issuance. Reset the user's password, revoke their session, change their CA policy — the token is still valid until it expires.

CAE closes that gap. When a critical event occurs — password change, MFA method update, location anomaly, session revocation — Entra ID signals the resource provider to immediately challenge the token. The user re-authenticates in near real-time.

Enable CAE in Entra ID under **Security → Conditional Access → Continuous Access Evaluation**. It's worth the (minimal) setup.

## What's Next

I'm currently working through the SC-300 (Microsoft Identity and Access Administrator) exam content, which goes deeper into identity governance, entitlement management, and access reviews. These are the operational layer sitting on top of this technical foundation — ensuring access is not just verified on entry but continuously reviewed and right-sized over time.

The goal isn't checkbox compliance. It's infrastructure that fails secure by default.
