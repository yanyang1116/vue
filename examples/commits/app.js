var apiURL = "https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha=";

/**
 * Actual demo
 */

var demo = new Vue({
  el: "#demo",
  data: {
    branches: ["master", "dev"],
    // currentBranch: "master",
    // commits: null,
  },
  // template: `afdsdf<! --文本部分 -->`,
  // template: `<div class="test" value =  "what" >123123</div>`,
  // template: `<div class="test" value =  "what" />`,
  // template: `<div><pre>hjkl<b>9999<b/></pre></div>`,
  // template: `<div> <div>ddd</div>   123123   </div>`,
  // template: `<div> asdf {{ 'asdfsafd' }}  </div>`,
  // template: `<pre> asdf {{ 'asdfsafd' }}  </pre>`,
  // template: `<pre> <div>asdf {{ 'asdfsafd' }}</div>  </pre>`,
  // template: `<div class="s123" > sdf </div>`,
  // template: `<div class="s123" :dataVal="'asdfsa'" />`,
  // template: `<pre v-pre v-if="231"> <div>asdf {{ 'asdfsafd' }}</div>  </pre>`,
  // template: `<div class="123" :style="[{ transform: 'rotate(7deg)' }]">asdfasdf</div>`,
  // template: `<div class="123" :style="[{ transform: 'rotate(7deg)' }]">asdfasdf</div>`,
  // template: `<div><span>ddd</span></div>`,
  // template: `<div>{{ branches.join() | a }}</div>`,
  // template: `<div><span>test</span></div>`,
  // template: `1`,
  // template: `#test`,
  template: `<div>asdfasdf</div>`,

  created: function () {
    // this.fetchData();
  },

  filters: {
    a(value) {
      return value + "123";
    },
  },

  watch: {
    // currentBranch: "fetchData",
  },

  filters: {
    // truncate: function (v) {
    //   var newline = v.indexOf("\n");
    //   return newline > 0 ? v.slice(0, newline) : v;
    // },
    // formatDate: function (v) {
    //   return v.replace(/T|Z/g, " ");
    // },
  },

  methods: {
    // fetchData: function () {
    //   var xhr = new XMLHttpRequest();
    //   var self = this;
    //   xhr.open("GET", apiURL + self.currentBranch);
    //   xhr.onload = function () {
    //     self.commits = JSON.parse(xhr.responseText);
    //     console.log(self.commits[0].html_url);
    //   };
    //   xhr.send();
    // },
  },
});
