import { group, check } from "k6";
import http from 'k6/http'
import * as helper from '../helpers/helper.js'

export const options = {
    ext: {
        loadimpact: {
            distribution: {
                'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 }
            },
        },
    },
    stages: [
        { target: 5, duration: "30s" },
        { target: 5, duration: "30s" },
        { target: 0, duration: "30s" },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<5000']
    },
};

export default function main() {
    let randomUserScenario = helper.getRandomNumber()

    let getCustomerAccountLoginPageRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/customer/account/login/',
        params: {
            tags: {
                name: 'RE - Get Customer Account Login Page',
            },
        }
    }

    let getVarnishAjaxNewIndexRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/varnish/ajax/newindex/?1668813544181',
        params: {
            headers: {
                accept: "application/json, text/plain, */*"
            },
            tags: {
                name: 'RE - Get Varnish',
            },
        }
    }

    let getMainPageRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/',
        params: {
            tags: {
                name: 'RE - Get Main Page',
            },
        }
    }

    let getCheckoutCartPageRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/checkout/cart/',
        params: {
            tags: {
                name: 'RE - Get Checkout Cart Page',
            },
        }
    }

    console.log("User Login Scenario")
    group(
        "Login Page - https://www.reserved.com/pl/pl/customer/account/login/#login", function () {
            let getCustomerAccountLoginPageResponse = http.get(getCustomerAccountLoginPageRequest.url, getCustomerAccountLoginPageRequest.params);
            check(getCustomerAccountLoginPageResponse, { 'GET - Customer Account Login Page status was 200': (r) => r.status == 200 })
            let formKey = helper.getFormKey(getCustomerAccountLoginPageResponse)

            let getVarnishAjaxNewIndexResponse = http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)
            check(getVarnishAjaxNewIndexResponse, { 'GET - Varnish status was 200': (r) => r.status == 200 })

            let postCustomerLoginRequest = {
                method: 'POST',
                url: 'https://www.reserved.com/pl/pl/ajx/customer/login/referer/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL3BsL3BsLw,,/uenc/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL3BsL3BsLw,,/?lpp_new_login',
                body: {
                    "login[username]": "performancetests0001@wp.pl",
                    "login[password]": "Qweasd12@",
                    "login[remember_me]": "0",
                    form_key: formKey,
                },
                params: {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    tags: {
                        name: 'RE - Post Customer Login',
                    },
                }
            }

            let postCustomerLoginResponse = http.post(postCustomerLoginRequest.url, postCustomerLoginRequest.body, postCustomerLoginRequest.params)
            check(postCustomerLoginResponse, { 'POST - Customer Login status was 200': (r) => r.status == 200 })
        })

    group("Main Page After Uset Log In - https://www.reserved.com/pl/pl/", function () {
        let getMainPageResponse = http.get(getMainPageRequest.url, getMainPageRequest.params);
        check(getMainPageResponse, { 'GET - Main Page status was 200': (r) => r.status == 200 })

        let getVarnishAjaxNewIndexResponse = http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)
        check(getVarnishAjaxNewIndexResponse, {
            'GET - Varnish status was 200': (r) => r.status == 200,
            'User has been logged in successfully': (r) => r.body.includes('Tomasz') == true
        })
    })

    if (randomUserScenario <= 19.00) {
        console.log("Checkout Cart Visit Scenario")
        group("Checkout Cart Page - https://www/reserved.com/pl/pl/checkout/cart/", function () {
            let getCheckoutCartPageResponse = http.get(getCheckoutCartPageRequest.url, getCheckoutCartPageRequest.params)
            check(getCheckoutCartPageResponse, { 'GET - Checkout Cart Page status was 200': (r) => r.status == 200 })

            let getVarnishAjaxNewIndexResponse = http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)
            check(getVarnishAjaxNewIndexResponse, { 'GET - Varnish status was 200': (r) => r.status == 200 })
        });
    }
}