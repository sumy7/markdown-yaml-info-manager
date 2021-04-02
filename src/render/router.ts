import { createRouter, createWebHashHistory } from "vue-router";
import Index from "./views/Index.vue";
import Create from "./views/Create.vue";
import LandingPage from "@/views/LandingPage.vue";
import FileListingPage from "@/views/FileListingPage.vue";
import ArticlesPage from '@/views/ArticlesPage.vue';
import CategoriesPage from '@/views/CategoriesPage.vue';
import TagsPage from '@/views/TagsPage.vue';
import CommitPage from '@/views/CommitPage.vue';
import SystemInformation from '@/views/LandingPage/SystemInformation.vue'; 

const router: any = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "landing-page",
      component: LandingPage as any,
    },
    {
      path: "/files",
      name: "file-list-page",
      component: FileListingPage as any,
    },
    // {
    //   path: "/files/articles",
    //   name: "file-articles-page",
    //   component: ArticlesPage as any,
    // },
    // {
    //   path: "/files/categories",
    //   name: "file-categories-page",
    //   component: CategoriesPage as any,
    // },
    // {
    //   path: "/files/tags",
    //   name: "file-tags-page",
    //   component: TagsPage as any,
    // },
    // {
    //   path: "/files/commit",
    //   name: "file-commit-page",
    //   component: CommitPage as any,
    // },
    // {
    //   path: "/sysinfo",
    //   name: "system-information",
    //   component: SystemInformation as any,
    // },
    {
      path: "/:catchAll(.*)",
      redirect: "/home",
    },
  ],
});

export default router;
