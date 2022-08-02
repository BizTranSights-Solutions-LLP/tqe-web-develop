 

 1. Homepage
PREDICTION SUCCESS data used API to update: 
var:  this.past_season_prediction / this.curr_season_prediction API route : BestBetsService -> getHomePageData ->
 > https://tqecustomer.imfast.io/homepage.json

 2. NFL player impact tool:
 API: 
> https://storage.googleapis.com/nflnfltest/public/nfl_lineup.json
3. Export iframes: 
4 in 1 pages for all player impact tools: 
- path: 
>  tqe-web-develop/src/app/front-panel/best-bets/all-player-impact-export.component.ts

- Auth in all-player-impact-export for all tools; 
- Current whitelists: 
"https://dev.rotoballer.com",
"https://www.rotoballer.com",
"https://staging.thequantumedge.com",
- Window postmsg example: 
`window.parent.window.postMessage({"key":"eyJtZXNzYWdlIjoiSldUIFJ1b", "data":"anything"}, 'https://staging.thequantumedge.com')`
4. Internal customer tool: 
- path: 
> 
> tqe-web-develop/src/app/front-panel/customer-internal/customerinternal.component.ts
>https://www.thequantedge.com/tool/1prmHTwjqYv4CyPFixzESVyytftQ91k7/internal/customer
- Api: 
Route: InternalCustomerService ->
For all other charts except **Next Month Payout**  getCustomerData() -> https://tqecustomer.imfast.io/customer.json
Sorted by time -> get newest 7 days data as init data 

  For **Next Month Payout**  chart: 
getNextMonthData() -> https://tqecustomer.imfast.io/next_month.json
Show all data
- chart.js references: 
https://www.chartjs.org/docs/latest/developers/

5. Post Affiliate Pro Integration 
Traffic Tracking code: 
- In index.html 
> \<body> \<script type="text/javascript" id="pap_x2s6df8d"
> src="https://tqe.postaffiliatepro.com/scripts/e12l27qj2m"></script>
> \<script type="text/javascript">
> PostAffTracker.setAccountId('default1'); try { PostAffTracker.track();
> } catch (err) { } \</body>
- Stripe integration (not completed)
doc: https://github.com/The-Quant-Edge/tqe-web-develop/blob/master/stripe-pap-int.md
6. News Letter: 
templates can be found: 
https://github.com/The-Quant-Edge/news-letter
