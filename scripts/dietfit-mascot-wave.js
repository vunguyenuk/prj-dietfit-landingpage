/* Shared greeting used by the Connected Health helper and the hero peeker.
   The helper plays these keyframes in time; the hero samples them from scroll. */
(function () {
  'use strict';
  const poses=[[0,0],[.12,-8],[.26,32],[.39,-16],[.52,29],[.65,-13],[.78,18],[1,0]];
  const easing='cubic-bezier(.4,0,.25,1)';
  function curve(t,a,b) { const r=1-t;return 3*r*r*t*a+3*r*t*t*b+t*t*t; }
  function ease(progress) {
    let lo=0,hi=1;
    for(let i=0;i<18;i++) { const t=(lo+hi)/2;if(curve(t,.4,.25)<progress)lo=t;else hi=t; }
    return curve((lo+hi)/2,0,1);
  }
  window.dietfitMascotWave={
    keyframes:function () {
      return poses.map(function (pose) { return {transform:'rotate('+pose[1]+'deg)',offset:pose[0],easing:easing}; });
    },
    angleAt:function (progress) {
      const p=Math.max(0,Math.min(1,progress));
      if(p===0||p===1)return 0;
      for(let i=1;i<poses.length;i++)if(p<=poses[i][0]){
        const a=poses[i-1],b=poses[i];
        return a[1]+(b[1]-a[1])*ease((p-a[0])/(b[0]-a[0]));
      }
      return 0;
    }
  };
}());
