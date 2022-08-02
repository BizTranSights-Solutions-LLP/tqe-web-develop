
Steps we did for Stripe Intergeation: 
For the front-end we use Angular.js, for back-end we use Laravel php connects Mysql db. 
Followe the turotial listed here: https://www.postaffiliatepro.com/integration-methods/integration/stripe/
Step1: 

> 1. Cookie data - order form Each customer account in stripe has an extra field called 'description'. In this integration method, we are
> using it. The task is to add the (tracking) cookie value into the
> description field found in your order form. The easiest way is to add
> this code to your payment form:
> 
>  - <input type="hidden" name="pap_custom" value=""
>        id="pap_tdx8v2s5a" />
>        
>        <script id="pap_x2s6df8d"
>        src="https://URL_TO_PostAffiliatePro/scripts/trackjs.js"
>        type="text/javascript"></script> <script type="text/javascript"> 
>        PostAffTracker.writeCookieToCustomField('pap_tdx8v2s5a');
>        </script>
> 
> When the form is submitted (customer is ordering), you can process the
> form data the standard way and before creating a charge and a customer
> account (with Stripe_Customer::create), you have to use the pap_custom
> data from the submitted form and set the value as a customer
> description - "description" => $_POST['pap_custom']

So we put the script code both in our project's index.html and the check-out (which in our case is the billing component) component's html page. 
You can find the path to the two html files in our staging server via: 

    /var/www/tqe-web-develop/src/index.html

and 

    /var/www/tqe-web-develop/src/app/front-panel/membership/billing-information/billing-information.component.html

in billing-information.component.html, the part i inserted is under the payment form: 
**![](https://lh5.googleusercontent.com/5h6d9IP4Q-HR7WBRJ-zTygsslfeix5Bb3-VJWKBGo5-8hUWn2f8Y3u0f3OFXRpzGJK-4vlpIGDw8YBtQuAcqwcFB_gSL9cTD7d_h97k3iudnOaOMhU3sO4kPFhGjcvVemvUyypSS)**
in index.html i also added the script tag just in case( since for angular that's where all scripts are):
 
**![](https://lh6.googleusercontent.com/aozcW_h10n-tkXSMKuNPnlgjpC06X4RSICO4LMJBzyxHKPVnwTHAVMs6ZVn8CA1QxEgRLtwCD9gzbekONkDfiV5Lw0wvPZSsZ-oYTiuZqfxPChtOBHQr1cGEwdApneFa6Vafamnn)**
So what i'm confused is this part mentioned in the tutorial: 

> When the form is submitted (customer is ordering), you can process the form data the standard way and before creating a charge and a customer account (with Stripe_Customer::create), you have to use the pap_custom data from the submitted form and set the value as a customer description - “description” => $_POST[‘pap_custom’]

Since we use Laravel to handle those requests, i was asuuming for this part we need to make changes in the Laravel's StripePaymentController.php.(I see you don't have the access to our back-end server, so i will attached the code here) i highlighted for you.
Please let me know if there's anything else that need to be added if we are using Laravel or this is wrong place to set this part 
**![](https://lh3.googleusercontent.com/Ucs7nXMPLoLfUgxwFn_oKNSvFAWp32qE7f4qhAimgafMqDHSc2DtB5lQIM3NLOJTrnWHc16EF7rioTJ8UnJ_TKXCuf1YAUqfzVulWAk7-IWHDxZ6KH3suktDTnKWuXSkphrRw1fe)**
After that, we followed step 3 and 4, in stripe, we created the webhook as below: 

**![](https://lh3.googleusercontent.com/nqB6GERq3SllmDgkb1oW5Zh0vp-6bZUPK1XDKITJzxH4I_vcNXX89-0SX3F1D5FNVsFnJDTTl_zTsMdAKGcFBeMHeow1pkE8Ym_FDqXTNoxu0winTeuWn_Ohg0ZDg9CfjG37qykB)**
and then for Plugin activation, we did:

**![](https://lh6.googleusercontent.com/yfjNf8SVoUHk0PlIGBlKmiJqKVxlfMKEGYUxH0347ISW6MIJ6TRmSRi6OP0jKek475YqalNfnomNyaKqkWUPc_hQTXpIr0UhwKsTSt6tmemzrzBJ0SsffFSkmnwgLKuNV_CmzpZd)**

**![](https://lh5.googleusercontent.com/fXlaHz_WEt_LkAD2xKOfQYailC06mHAWNx70ktxRv67AX7cNp6_UzAGocxiBUYz3XC-GjZOfJeUr4YOiSXXnlaHnf49rOM22aYyn8qsipdXRzq2S6wOmQjEvKzdRBELAMKhNBF7q)*

we also set up the secret API Key using this one found in stipe: 


**![](https://lh3.googleusercontent.com/buo14EBpc4U6hnfY_kZTDZZ6FT80hZXRmWu90Vgx93zvwR4g5bar-9vs2fi8Pqm1CyUbcrjeRFZwN4s_C8rVOAL5x07Sp_-uyDSky_4gyj6V11XD0yK20gLIwEX6Q1bvRyLcudW-)**

And please check Gengyuan's email for our transaction logs, and let us know if you can see where's the problem and we can make changes to it accordingly! 

Thank you very much!
