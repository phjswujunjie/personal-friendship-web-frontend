export default {
  // routes: [{
  //   path: "/:id",
  //   component: () => import("../components/Homepage"),
  //   children: [{
  //     path: "/:id/blog",
  //     component: () => import("../components/Blog")
  //   },{
  //     path: "/:id/selected",
  //     component: () => import("../components/Selected")
  //   },{
  //     path: "/:id/album",
  //     component: () => import("../components/Album")
  //   }],
  // },{
  //   path: "/:id/fans",
  //   component: () => import("../components/Fans")
  // },{
  //   path: "/:id/follow",
  //   component: () => import("../components/Follow")
  // },{
  //   path: "/:id/friend",
  //   component: () => import("../components/Friend")
  // }
  // ],
  routes:[
    {
      path: "/homepage",
      component: () => import("../components/Homepage/Homepage")
    },
    {
      path: "/around",
      component: () => import("../components/Around/Around")
    },
    {
      path: "/createBlog",
      component: () => import("../components/MainModule/CreateBlog")
    },
    {
      path: "/personalInfo",
      component: () => import("../components/MainModule/PersonalInfo")
    },
    {
      path: "/blogComment/:blogId",
      component: () => import("../components/BlogComment/BlogComment")
    },
    {
      path: "/login",
      component: () => import("../components/MainModule/Login")
    },
    {
      path: "/register",
      component: () => import("../components/MainModule/Register")
    },
    {
      path: "/editPhoto",
      component: () => import("../components/MainModule/EditPhoto")
    },
    {
      path: "/search/:condition",
      component: () => import("../components/MainModule/Search")
    },
    {
      path: "/u",
      component: () => import("../components/PersonalInfoHomepage/PersonalHomepage"),
      redirect: "/homepage",
      children: [
        {
          path: "/u/:id",
          component: () => import("../components/PersonalInfoHomepage/Homepage"),
          children: [
            {
            path: "/u/:id/blog",
            component: () => import("../components/PersonalInfoHomepage/Blog")
            },
            {
            path: "/u/:id/selected",
            component: () => import("../components/PersonalInfoHomepage/Selected")
            },
            {
            path: "/u/:id/album",
            component: () => import("../components/PersonalInfoHomepage/Album")
            }
          ],
        },
        {
          path: "/u/:id/fans",
          component: () => import("../components/PersonalInfoHomepage/Fans")
        },
        {
          path: "/u/:id/follow",
          component: () => import("../components/PersonalInfoHomepage/Follow")
        },
        {
          path: "/u/:id/friend",
          component: () => import("../components/PersonalInfoHomepage/Friend")
        },
      ]
    },
    {
      path: "/chat",
      component: () => import("../components/Chat/Chat"),
      redirect: "/chat/noSelect",
      children: [
        {
          path: "userChat/:id",
          component: () => import("../components/Chat/User")
        },
        {
          path: "noSelect",
          component: () => import("../components/Chat/NoSelect")
        },
      ]
    }
  ],
  mode: 'history',
}
