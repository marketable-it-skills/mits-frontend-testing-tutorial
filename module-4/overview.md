# Module 4: Stations List + Station Detail & Reserve

## Overview

Implement Module G **A3** (`03_stations.cy.js`) and **A4** (`04_station_detail.cy.js`). You will assert authenticated station lists and filters, public browse without login, open a station hub from a card, reserve a swap hold, handle a forced 409 conflict via `__force-conflict`, and block a second reserve while another hold is active.

## What is rider availability?

Each station card (and the detail hub) shows **`riderAvailability`** from the API: whether a ready battery/bay matches the signed-in profile. Guests see a sign-in hint; Lin (`SL-48`) sees ready-pack copy on swap-capable stations and “no ready battery” on charging-only sites.

## What You'll Learn

- List + filter assertions with `data-testid` cards (`station-card-{id}`)
- Public vs authenticated browse of `/stations.html`
- Navigation from card → `station.html?id=…`
- Happy-path **Reserve battery** → Activity
- Arming one conflict with `POST /api/v1/__force-conflict`
- Asserting API conflict messages without inventing availability text
- Blocking a second reserve + reaching Activity via nav

## Why This Matters

Reserve and conflict handling are the core SwapLoop competition flows. Getting selectors and `__reset` / `__force-conflict` fixtures right here unblocks Module 5 activity journeys.

## PRD Connection

Implements **§5.2 A3–A4**.

## Prerequisites

- Modules 1–3 complete
- `signInAsLin()` pattern from Module 2/3

## Time Estimate

⏱️ **3–4 hours**

## Module Structure

1. Stations list (signed-in)  
2. Type filter (`SWAP`)  
3. Compatibility badges  
4. Unauthenticated browse  
5. Open station detail  
6. Reserve when eligible  
7. Forced conflict messaging  
8. Second-reserve blocked + Activity link  
9. Git workflow  

## Expected Result

Fully green `03_stations.cy.js` and `04_station_detail.cy.js`.
