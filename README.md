# Photo Buddy (rough, working title)

## What is this app?
This app will auto-capture and recognize receipts (name of merchants/restaurants, item type such as food, transportation, gifts etc and currency/amounts) for various useful purposes, such as adding up amounts spent etc. Crucially, all of the AI image analysis can work locally, enhancing privacy.

### Who is this for?
- B2C Consumers – Anyone who are very privacy-conscious and prefer private info like receipts to store ONLY locally on the PCs
- B2B Commercial – EDU school districts (teachers, students), Governments and Enterprises
- This is perfect for both sighted and blind/low vision users.

### Supported platforms
- Can work anywhere, including in the browser.
- Windows is the main platform that drives design etc. This should feel like a good app on Windows.

## Target user scenario
- User goes on a trip, lets say to Port Angeles.
- User spends money and gets receipts while there.
- User has photos on a windows device, probably through OneDrive from there phone
- User wants to know how much money they spent in total while in Port Angeles.
- User adds images to the app and either groups them or searches for "Port Angeles"
- User can then see the total of what they spent

## Key Technical Features
- Private: All AI can be run locally, and does by default. Image analysis should ideally happen on the NPU if the device has an NPU, but GPU is our main platform.
- Fast: Should be fast to open and fast to use
- Best on Windows: Completely cross-platform but best on Windows

## Getting Started Developing
This app is built as a [Progressive Web Application](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/) using the PWABuilder PWA Starter:

[**Straight to Full Documentation**](https://docs.pwabuilder.com/#/starter/quick-start)

The PWABuilder Whisper pwa-starter is based on our opinionated, best practices, production tested starter that we use to build all of our PWAs, including [PWABuilder itself](https://blog.pwabuilder.com/posts/introducing-the-brand-new-pwa-builder/)! The pwa-starter is a starter codebase, just like create-react-app or the Angular CLI can generate, that uses the PWABuilder team&#39;s preferred front-end tech stack. We also have a CLI tool to allow you to create a PWA template from the command line.

This "Whisper" version of the starter sets you up with all the code you need to use Whisper to transcribe audio and video, on your device using [transformers.js](https://huggingface.co/docs/transformers.js/index), which uses [Onnxruntime](https://onnxruntime.ai/) to run Whisper client-side on your device, no cloud needed.

### Jump Right In

After you have cloned this starter to your machine, run through the following steps.

Install Dependencies:

`npm install`

And then start developing your app with:

`npm run dev`

With that command, the app will open in the browser and will update when you make changes to the code.
And that's it! Good luck on your Progressive Web App adventure!

