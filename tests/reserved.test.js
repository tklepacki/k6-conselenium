import { group } from "k6";
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
  thresholds: {},
};

export default function main() {
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

  group(
    "Login Page - https://www.reserved.com/pl/pl/customer/account/login/#login", function () {
      let getCustomerAccountLoginPageResponse = http.get(getCustomerAccountLoginPageRequest.url, getCustomerAccountLoginPageRequest.params);
      let formKey = helper.getFormKey(getCustomerAccountLoginPageResponse)

      http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)

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

      http.post(postCustomerLoginRequest.url, postCustomerLoginRequest.body, postCustomerLoginRequest.params)
    })

  group("Main Page After Uset Log In - https://www.reserved.com/pl/pl/", function () {
    http.get(getMainPageRequest.url, getMainPageRequest.params);

    http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)
  })
}
