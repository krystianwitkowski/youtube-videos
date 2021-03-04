<template>
    <div class="video-frame">
        <iframe width="100%" height="315" :src="'https://www.youtube.com/embed/' + idVideo">
        </iframe>
    </div>

</template>
<script>
export default {
    props: {
        idVideo: String
    }
}
</script>

<style>
    .video-frame {
        display: none;
        margin-top: 30px;
    }

    .dashboard .video-show {
        display: block;
    }
</style>