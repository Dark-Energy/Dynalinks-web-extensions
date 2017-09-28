<template>
<div id="message-block" class="error-message">
	<h1>Error</h1> 
	<p>{{message}}</p>
</div>
</template>

<script>
export default {
	props: ['message'],
	name: 'ErrorMessage',
}
</script>
