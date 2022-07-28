<template>
  <Card>
      {{metadata}}
  </Card>
</template>

<script>
import Card from 'primevue/card'

export default {
    props: ['metadata'],
    component: {
        Card,
    }

}
</script>

<style>

</style>