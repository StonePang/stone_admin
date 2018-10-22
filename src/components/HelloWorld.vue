<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li v-if='err'>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <el-button @click='validate' type='warning'>validate</el-button>
    <el-button @click='clearErr' type='primary'>clearErr</el-button>
    <el-input v-model='input'></el-input>
  </div>

</template>

<script>
import moment from "~utils/date";
import Validator from "~utils/async-validator";
import AsyncQueue from '~utils/async-queue'
// import AsyncValidator from "async-validator";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      input: null,
      data: {
        name: this.input,
      },
      rule: {
        name: [
          {
            type: "number",
            message: "输入数字"
          },
          {
            min: 5,
            message: "至少5个"
          },
          {
            validator: (rule, value, callback) => {
              if (value !== "wwer") {
                let err = "不是指定";
                callback(err);
              } else {
                callback();
              }
            }
          }
        ]
      },
      validator: {},
      err: null
    };
  },
  methods: {
    validate() {
      // this.validator = new Validator(this.model, this.rule);
      // this.validator.validate().catch(err => {
      //   this.err = err;
      //   console.log(this.err, this.model);
      // });
      Validator(this.model, this.rule)
        .then(data => {
          console.log("then", data);
        })
        .catch(err => {
          console.log("catch", err);
        });
    },
    clearErr() {
      this.err = null;
    },
    test(n) {
      return new Promise((res, rej) => {
        if(n > 10) {
          rej(n)
        } else {
          res(n)
        }
      })
    },
    gua1(n) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log('in ', 1)
          if(n > 10) {
            rej(n+1)
          } else {
            res(n -1)
          }
        }, 2000)
      })
    },
    gua2(n) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log('in ', 2)
          if(n > 10) {
            rej(n+1)
          } else {
            res(n -1)
          }
        }, 1000)
      })
    },
    gua3(n) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log('in ', 3)
          if(n > 10) {
            rej(n+1)
          } else {
            res(n -1)
          }
        }, 500)
      })
    },
    queue(arr, ...arg) {
      var sequence = Promise.resolve(...arg)
      arr.reduce((pre, fn) => {
        console.log(pre)
        return pre.then(data => {
          return fn(data)
        })
      }, sequence)
      return sequence
    }
  },
  computed: {
    model() {
      return {
        name: this.input
      };
    }
  },
  watch: {
    input(val) {
      this.validate();
    }
  },
  created() {
    let arr = [this.gua1, this.gua2, this.gua3]
    let queue = new AsyncQueue(arr)
    let result = queue.handler(11)
    result.then(data => {
      console.log(data)
    }).catch(err => {
      console.log('err', err)
    })
    // this.gua(1).then(() => {
    //   return this.gua(2, 1000)
    // }).then(() => {
    //   return this.gua(3, 2000)
    // })
    // this.test(1).then(data => {
    //   console.log('then_1', data)
    //   return this.test(data + 5)
    //     // .then(data => {
    //     //   console.log('in then', data)
    //     //   return Promise.reject(data + 5)
    //     // })
    //   .catch(data => {
    //     console.log('in catch', data)
    //     // return Promise.reject(data + 5)
    //     return data + 5
    //   })
    // }).then(data => {
    //   console.log('then_2', data)
    //   return data + 5
    // }).then(data => {
    //   console.log('then_3', data)
    //   return data + 5
    // }).catch(data => {
    //   console.log('catch', data)
    //   return data + 5
    // }).then(data => {
    //   console.log('then_4', data)
    //   return data + 5
    // }).catch(data => {
    //   console.log('catch_2', data)
    //   return data + 5
    // })
    // // this.test(7).then(data => {
    // //   console.log('then_1', data)
    // //   return this.test(data + 5)
    // // }).then(data => {
    // //   console.log('then_2', data)
    // //   return data
    // // }).then(data => {
    // //   console.log('then_3', data)
    // // }).catch(data => {
    // //   console.log('catch', data)
    // // })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
