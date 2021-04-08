export default function () {
  this.setDefault({ duration: 200 });
  this.transition(
    this.use('fade'),
    this.reverse('fade')
  );
  this.transition(
    this.withinRoute("main.stellarpedia"),
    this.use('fade'),
    this.reverse('fade')
  );
}