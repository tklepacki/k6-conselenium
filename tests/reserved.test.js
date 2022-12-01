import { group } from 'k6'
import http from 'k6/http'
import * as helper from '../helpers/helper.js'

export const options = {
    ext: {
        loadimpact: {
            distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
        },
    },
    stages: [
        { target: 5, duration: '30s' },
        { target: 5, duration: '30s' },
        { target: 0, duration: '30s' },
    ],
    thresholds: {},
}

export default function main() {
    let getCustomerAccountLoginPageRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/customer/account/login/'
    }

    let getVarnishAjaxNewIndexRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/varnish/ajax/newindex/?1669888983884',
        params: {
            headers: {
                accept: 'application/json, text/plain, */*',
            }
        }
    }

    let getMainPageRequest = {
        method: 'GET',
        url: 'https://www.reserved.com/pl/pl/'
    }

    group('Login Page - https://www.reserved.com/pl/pl/customer/account/login/#login', function () {
        let getCustomerAccountLoginPageResponse = http.get(getCustomerAccountLoginPageRequest.url)
        let formKey = helper.getFormKey(getCustomerAccountLoginPageResponse)

        http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)

        let postCustomerLoginRequest = {
            method: 'POST',
            url: 'https://www.reserved.com/pl/pl/ajx/customer/login/referer/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL3BsL3BsLw,,/uenc/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL3BsL3BsLw,,/?lpp_new_login',
            body: {
                'login[username]': 'performancetests0001@wp.pl',
                'login[password]': 'Qweasd12@',
                'login[remember_me]': '0',
                form_key: formKey,
            },
            params: {
                headers: {
                    accept: 'application/x-www-form-urlencoded; charset=UTF-8',
                }
            }
        }

        http.post(postCustomerLoginRequest.url, postCustomerLoginRequest.body, postCustomerLoginRequest.params)
    })

    group('page_3 - https://www.reserved.com/pl/pl/', function () {
        http.get(getMainPageRequest.url,)

        let getVarnishAjaxNewIndexResponse = http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)
        console.log(getVarnishAjaxNewIndexResponse.body)
    })
}
