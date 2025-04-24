<template>
  <div class="mb-10">
    <h1 class="relative text-center text-[25px] leading-[30px] py-4 tracking-[1.5px] font-bold underline-heading">
      <slot />
    </h1>
  </div>
</template>

<style scoped>
.underline-heading::before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 80px;
  height: 5px;
  border-top: solid 1px #0068c8;
  border-bottom: solid 1px #0068c8;
  left: calc((100% - 80px) / 2);
}
</style>
