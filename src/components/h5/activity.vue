<template>
    <div class="activity">
        <ul>
            <li><img src="../../../static/image/415_01.jpg" alt=""></li>
            <li><img src="../../../static/image/415_02.jpg" alt=""></li>
            <li><img src="../../../static/image/415_03.jpg" alt=""></li>
            <li><img src="../../../static/image/415_04.jpg" alt=""></li>
            <li><img src="../../../static/image/415_05.jpg" alt=""></li>
            <li><img src="../../../static/image/415_06.jpg" alt=""></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'activity'
}
</script>

<style scoped>
.activity {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -moz-overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
}
.activity > ul {
    width: 100%;

}
.activity > ul > li {
    width:100%;
}
.activity > ul > li > img {
    display: block;
    width: 100%;
}
</style>

