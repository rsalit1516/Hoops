using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Core.ViewModels
{
    public class WebContentVm
    {
        public int WebContentId { get; set; }
        public int? ContentSequence { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Body { get; set; }
        public string Location { get; set; }
        public string DateAndTime { get; set; }
        public string WebContentTypeDescription { get; set; }
        
    }
}
