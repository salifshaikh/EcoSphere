import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, PhoneCall, MapPin, ArrowRight, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15, duration: 0.8, delay: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.5 } }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className="bg-gradient-to-br from-emerald-900 to-blue-900 text-white pt-16 pb-8 border-t-4 border-green-500"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div variants={itemVariants} className="mb-8 md:mb-0">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-green-400 mr-2" />
              <h2 className="text-3xl font-bold">Eco<span className="text-green-400">Sphere</span></h2>
            </div>
            <p className="mt-3 text-gray-300 max-w-md">
              Connecting individuals passionate about sustainability and environmental conservation through shared stories and experiences.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full md:w-auto">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Join Our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex">
              <div className="relative flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-emerald-800/50 border border-emerald-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-emerald-400/70"
                  required
                />
                {subscribed && (
                  <div className="absolute -top-10 left-0 right-0 bg-green-600 text-white text-center py-2 rounded-lg">
                    Thanks for subscribing!
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-r-lg transition-colors flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-green-300 flex items-center">
              <Leaf className="w-5 h-5 mr-2" />
              About Us
            </h3>
            <p className="text-gray-300 leading-relaxed">
              EcoSphere is a community platform dedicated to sharing sustainable stories, eco-friendly tips, and environmental initiatives. Our mission is to inspire positive change for our planet through collective action.
            </p>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors flex items-center">
                Our Mission <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-green-300">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', link: '/' },
                { name: 'Eco Stories', link: '/eco-stories' },
                { name: 'Sustainability Tips', link: '/tips' },
                { name: 'Community Projects', link: '/projects' },
                { name: 'Events Calendar', link: '/events' },
                { name: 'Resources', link: '/resources' }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-green-300">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Green Tech Hub, Eco Valley, Sustainable City 12345</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <a href="mailto:hello@ecosphere.com" className="text-gray-300 hover:text-green-400 transition-colors">
                  hello@ecosphere.com
                </a>
              </li>
              <li className="flex items-center">
                <PhoneCall className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-green-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Media Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-green-300">Connect With Us</h3>
            <p className="text-gray-300 mb-4">
              Follow us on social media for daily eco-tips, inspiring stories, and community updates.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Facebook className="w-5 h-5" />, link: "https://facebook.com", color: "bg-blue-600" },
                { icon: <Twitter className="w-5 h-5" />, link: "https://twitter.com", color: "bg-sky-500" },
                { icon: <Instagram className="w-5 h-5" />, link: "https://instagram.com", color: "bg-pink-600" },
                { icon: <Linkedin className="w-5 h-5" />, link: "https://linkedin.com", color: "bg-blue-700" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} hover:opacity-90 transition-opacity p-3 rounded-lg flex items-center justify-center`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-700 to-transparent my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <motion.p variants={itemVariants}>
            © {new Date().getFullYear()} EcoSphere - Where nature meets life. All rights reserved.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;