export default function(){
  /*this.transition(
    this.outletName("navSidebarOutlet"),
    this.use('toLeft'),
    this.reverse('toRight')
  );*/
  this.transition(
    this.use('toLeft'),
    this.reverse('toRight')
  );
}