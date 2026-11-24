# Amelia: Skip Package Popup

**Version:** 0.1.0

Automatically skips the "packages" suggestion popup in the [Amelia](https://wpamelia.com/) step-by-step booking form, so customers go straight from choosing a service to the next step.

## The problem

When a service is part of one or more packages, Amelia's step-by-step booking form shows a slide-up popup suggesting those packages after the customer clicks Continue on the Service selection step. There is no setting to turn it off, and it adds an extra click (and some confusion) for customers who just want to book a single session.

## How it works

1. Hides the packages popup with CSS so customers never see it flash.
2. Watches the page for the popup to appear (inline forms and forms opened in a modal).
3. Waits until the popup's Skip button has stopped moving (the slide-in animation has finished). Clicking during the animation can leave the form blank.
4. Clicks Skip, and the form carries on to the next step.

**Fallbacks, so customers are never stuck:**

- If Skip can't be clicked within 5 seconds, the popup is shown so the customer can skip it themselves.
- If the popup is still there 3 seconds after the click, it's shown again.

## Install

Add [`kmp-amelia-skip-package-popup.js`](kmp-amelia-skip-package-popup.js) as a site-wide JavaScript snippet in the footer, using WPCode or Simple Custom CSS & JS. See the [main README](../../README.md#how-to-install) for step-by-step instructions.

## Notes

- Works with the form inline on a page or opened in a popup/modal (for example from a header "Book" button), as long as the snippet runs site-wide.
- Only run one copy. Remove or disable any older version of this snippet first.
- After installing, test the full booking flow, including on mobile, and check that prices and payment steps still show as expected.

## No-code alternative

Amelia support has suggested using the shortcode `[ameliastepbooking show=services]`, which hides packages from that booking form entirely. That only suits sites that don't sell packages through that form, and it hasn't been tested here. If you do sell packages through the same form, use this snippet instead.

## References / known issue

- [Amelia docs: Step-by-step booking form](https://wpamelia.com/documentation/step-by-step-booking-form/): package suggestions appear when the selected service is part of a package, with no option to disable them.
- [Amelia support ticket #3410332: "Packages Pop Up" (July 2023)](https://tmsplugins.ticksy.com/ticket/3410332/)
- [Amelia support ticket #3192379: "Questions about Services & Packages" (Dec 2022)](https://tmsplugins.ticksy.com/ticket/3192379/): asking to deactivate the package push.
- Related feature requests: [nolt #4993](https://wpamelia.nolt.io/4993) and [nolt #2471](https://wpamelia.nolt.io/2471).

## Disclaimer

This is an unofficial snippet and is not affiliated with or endorsed by Amelia or TMS. It relies on Amelia's current markup (`.am-package-popup` and `.am-slide-popup__block-footer button`), so it may need updating if Amelia changes its booking form.

## Licence

[MIT](../../LICENSE) © 2026 Kingsley Media Productions
