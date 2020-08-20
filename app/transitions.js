export default function () {
  this.transition(
    this.use('toLeft'),
    this.reverse('toRight'),
  );
  this.transition(
    this.outletName("navSidebarOutlet"),
    this.use('fade'),
    this.reverse('fade')
  );
}