## What You'll Need
*   A [Facebook account](https://www.facebook.com/)

## Step 1: Set up your Facebook App
To get started, [remix this example project](https://gomix.com/#!/remix/FBMessenger/ca73ace5-3fff-4b8f-81c5-c64452145271) so that you have your own copy of the code. 

Then from the [Facebook Developer site](https://developers.facebook.com/), log in and select 'Add a New App' from the top-right 'My Apps' drop-down. Select 'website' and enter a name for your new app. For the site URL, you can enter the publish URL of your project - that's the URL in the tab that opens when you click 'Show'. It will have the format 'https://project-name.gomix.me,' so for our example app, the URL is https://messenger-bot.gomix.me. In the 'Next Steps' section, click on the link to 'Skip to Developer Dashboard'.

## Step 2: Configure your Facebook App
From the Facebook App dashboard, select 'Add Product' and choose the 'Messenger' option and click on the 'Get Started' button. From there you need to generate a Page Access Token - select the Facebook page that relates to your bot (if you don't have one, you can create one from Settings > Advanced > App Page - 'Create New Page') from the 'Select a Page' drop-down menu.

You then want to set up a Webhook. Click on 'Setup Webhooks' and in the pop-up box, enter your project's publish URL again with '/bot' appended into the Callback URL box. This is the URL with the format 'https://project-name.gomix.me,' so for our example app, the Callback URL is: 'https://messenger-bot.gomix.me/bot'. Check all subscription fields, and provide a Verify Token. This is a token you make up, which your app will use to verify that requests are coming from Facebook - it's best if it's something that would be difficult to guess and it needs to be all one word, no spaces.

## Step 3: Copy your App Credentials
Your app is now set up in Facebook, but your projects needs to be able to use it. To do so, you have to copy and paste the main app credentials into the `.env` file in your project. There are entries for:

*   `PAGE_TOKEN` - Copy the Page Access Token from the Token Generation section of the Messenger tab under the App dashboard in Facebook.
*   `VERIFY_TOKEN` - This is the token you made up.
*   `APP_ID` and `APP_SECRET` - These are provided on your App's dashboard homepage on Facebook.
*   `PAGE_ID` - On your Facebook page, go to the About tab and at bottom of the 'Page Info' section is a value for 'Facebook Page ID'.

With those details in, your app should now work. To test it, click on 'Show' and you'll see the Facebook messenger button - if your App and Page ID are correct, then when you click on it, you'll be taken to the Messenger site and you can begin sending messages to your Bot. As you type and send messages it will echo your messages back to you. You can view the logs to confirm that it's echoed a message back to the user, or view any error messages.


## Getting Help
You can see other example projects on our [Community Projects](https://gomix.com/community/) page. And if you get stuck, let us know on the [forum](http://support.gomix.com/) and we can help you out.