<template>
    <div>
      <topic-question/>
    </div>
</template>
      
  <script>
    import TopicQuestion from "@/modules/admins/survey/topic-question.vue";
    import Topic from "@/modules/admins/survey/topic.vue";
    
    export default {
      components: {
        TopicQuestion
      },
      setup() {},
    };
</script>