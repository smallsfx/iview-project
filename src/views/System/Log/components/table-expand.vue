<template>
    <Card :bordered="false">
        <!-- <p slot="title">{{row}}</p> -->
        <p>{{row.content}}</p>
    </Card>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>